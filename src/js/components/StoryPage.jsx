/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Enum from 'easy-enums';
import _ from 'lodash';
import SJTest, { assert } from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import C from '../C';
import Game, { doLoad, doSave, doReset } from '../Game';
import Misc from '../base/components/Misc';
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import PropControl, { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
import Key, { KEYS } from '../Key';
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col, Card, CardTitle } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import GameAdmin, { doNewWorld } from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Fight from '../data/Fight';
import Monster from '../data/Monster';

import ReactVivus from 'react-vivus';
import { space, randomPick, asNum, substr } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import ServerIO from '../base/plumbing/ServerIOBase';
import MDText from '../base/components/MDText';
import BG from '../base/components/BG';
import Tree from '../base/data/Tree';
import ChatLine, { splitLine } from './ChatLine';
import deepCopy from '../base/utils/deepCopy';
import StoryTree from '../data/StoryTree';
import { CHARACTERS } from '../Character';

let ticker = new StopWatch({tickLength:700});
const spaceKey = new Key(" ");
// TODO refactor init and game loops
const init = () => {
	const game = Game.get();	
	game.player = CHARACTERS.james;
};
init();

const Emoji = ({children}) => <span aria-label="emoji" role="img">{children}</span>;

const StoryPage = () => {
	let chapterFile = DataStore.getValue('location','path')[1] || 'chapter1';
	let pvChapter = DataStore.fetch(['misc','book',chapterFile], () => {
		return ServerIO.load("/data/book/"+chapterFile+".md");
	});
	if ( ! pvChapter.value) return <Misc.Loading/>;

	let chapter = pvChapter.value;
	let _title = chapter.match(/^# (.+)$/m);
	let title = (_title && _title[1]) || "";
	
	const storyTree = DataStore.getValue(['misc','StoryTree',chapterFile]) || DataStore.setValue(['misc','StoryTree',chapterFile], new StoryTree(chapter), false);
	StoryTree.currentStoryTree = storyTree;
	window.storyTree = storyTree;	

	let bookmark = DataStore.getUrlValue('bookmark') || DataStore.setUrlValue('bookmark', "", false);
	// if (bookmark) { TODO fast forward for ease of testing (but not playing 'cos game state, e.g. you picked Dinosaur)
	// 	StoryTree.
	// }

	// get a text node
	let currentNode = StoryTree.current(storyTree);
	while(currentNode) {
		// skip over no text and also test {if...} nodes
		// NB: choice nodes which begin | are not skipped
		if (currentNode.value && currentNode.value.text) {
			// HACK dont skip {explore nodes
			if (currentNode.value.text[0] !== '{' || currentNode.value.text.substr(0,8) === '{explore') {
				break;
			}
		}
		currentNode = StoryTree.next(storyTree);
	}
	const seenNodes = Tree.flatten(storyTree.history);
	const currentText = currentNode && currentNode.value.text || '';
	
	// space = next, unless there's a choice
	spaceKey.press = e => StoryTree.next(storyTree);
	if (currentText[0] === '|') spaceKey.press = null; // TODO beep
	// ??auto-space just before a choice

	setTimeout(() => DataStore.update(), 500);	
	
	return (<div className="open-book container">		
		
		<div className="right-page">				
			<div className="story-zone">
				{seenNodes.map((t,i) => <StoryLine key={i} node={t} isLatest={i+1 === seenNodes.length} />)}
				<ScrollIntoView watch={seenNodes.length} />
			</div>
			
			{splitLine(currentText) && <ChatLine line={currentText} />}

			<hr/>
			<div className="control-zone"><Buttons currentNode={currentNode} storyTree={storyTree} /></div>
			
		</div>
	</div>);
};


const ScrollIntoView = ({watch}) => {
	const endRef = useRef();	
	// TODO watch to allow user scrolling back up
	// const scrollToBottom = () => {
	if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
	// };	
	// useEffect(scrollToBottom, [watch]);
	
	return <div ref={endRef} />;
};

const Buttons = ({currentNode, storyTree}) => {
	let text = StoryTree.text(currentNode);
	if ( ! text) return "END OF STORY (TODO)";
	if (text[0]==="|")	{
		const i = text.indexOf("| ");
		let thenbit = i>0? text.substr(i+1).trim() : "";
		let choicebit = i>0? text.substr(0, i) : text;
		let choices = choicebit.split("|").filter(c => c);
		// bump right to avoid accidental next clicks
		return (<div className="ml-5">
			{choices.map(c => 
				<Button size='lg' className="ml-2 mr-2" color="primary" onClick={e => doChoice({currentNode, storyTree, c, thenbit})} key={c}>{c}</Button>
			)}
		</div>);
	}
	return <Button size='lg' color="primary" onClick={e => StoryTree.next(storyTree)} ><Emoji>✏️</Emoji> ... (space)</Button>;
};

const doChoice = ({currentNode, storyTree, c, thenbit}) => {	
	// TODO modify history not source
	currentNode.value.text = c;
	storyTree.lastChoice = c;
	// HACK add to inventory
	if (thenbit===">> inventory") {
		const inventory = Game.getInventory(Game.get());
		inventory[c] = (inventory[c] || 0) + 1;
	}
	StoryTree.next(storyTree);
};

const StoryLine = ({node, isLatest}) => {
	let text = node.value && node.value.text;
	if ( ! text) return null;
	// Is it a choice?
	if (text[0]==='|') {
		return null;
	}
	// HACK any stats bonuses?
	// if (isLatest) { TODO a nice boost animation
	let mb = text.match(/(\w+)\s*\+=\s*(\d+)/);
	if (mb && "courage knowledge ".includes(mb[1])) {
		text += " `("+mb[1]+" boost!)`";
	}	
	// Remove any code. The test and commands are handled in StoryTree.nextTest / next
	let restOfLine = text.replaceAll(/{[^}]+}/g,'');
	if ( ! restOfLine) return null;
	text = restOfLine;	
	// Is it dialogue? remove the emotion marker
	let m = splitLine(text);
	if (m) {
		text = m.label+': "'+m.said+'"';
	}
	// spot scenes
	let se = substr(node.value.index, -2);
	if (se === ".0" && text[0] !== '#') {
		text = "## "+text;
	}
	// one word at a time (but not for dialogue as that'd distract from the popup)
	if (isLatest && ! m) {
		let [stopWatch] = useState(new StopWatch());
		StopWatch.update(stopWatch);
		let dt = StopWatch.time(stopWatch);
		let nw = Math.round(dt / 25);
		text = text.substr(0,nw); //words.join(" ");
		// avoid half styling 
		text = text.replace(/[~*]+(\w+)$/,"$1");
	}

	return <MDText source={text} />;
};


export default StoryPage;
