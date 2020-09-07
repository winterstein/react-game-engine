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
import ChatLine, { rSpeech } from './ChatLine';
import deepCopy from '../base/utils/deepCopy';
import StoryTree from '../data/StoryTree';

let ticker = new StopWatch({tickLength:700});
const spaceKey = new Key(" ");


const Emoji = ({children}) => <span aria-label='emoji' role='img'>{children}</span>;

const StoryPage = () => {
	const chapterNum = 1;
	let pvChapter = DataStore.fetch(['misc','chapter',chapterNum], () => {
		return ServerIO.load("/data/book/chapter1.md");
	});
	if ( ! pvChapter.value) return <Misc.Loading/>;

	let chapter = pvChapter.value;
	let _title = chapter.match(/^# (.+)$/m);
	let title = (_title && _title[1]) || "";
	
	const storyTree = DataStore.getValue(['misc','StoryTree',chapterNum]) || DataStore.setValue(['misc','StoryTree',chapterNum], new StoryTree(chapter), false);
	window.storyTree = storyTree;	

	let bookmark = DataStore.getUrlValue('bookmark') || DataStore.setUrlValue('bookmark', "", false);

	// get a text node
	let currentNode = StoryTree.current(storyTree);
	while(currentNode) {
		// skip over no text and also test {if...} nodes
		// NB: choice nodes which begin | are not skipped
		if (currentNode.value && currentNode.value.text && currentNode.value.text[0] !== '{') {
			break;
		}
		currentNode = StoryTree.next(storyTree);
	}
	const seenNodes = Tree.flatten(storyTree.history);
	const currentText = currentNode && currentNode.value.text || '';
	
	// space = next, unless there's a choice
	spaceKey.press = e => StoryTree.next(storyTree);
	if (currentText[0] === '|') spaceKey.press = null; // TODO beep

	setTimeout(() => DataStore.update(), 500);	
	
	return (<div className='open-book container'>		
		
		<div className='right-page'>				
			<div className='story-zone'>
				{seenNodes.map((t,i) => <StoryLine key={i} node={t} isLatest={i+1 === seenNodes.length} />)}
				<ScrollIntoView watch={seenNodes.length} />
			</div>
			
			{currentText.match(/^[a-zA-Z0-9 ]+:/)? <ChatLine line={currentText} /> : null}

			<hr/>
			<div className='control-zone'><Buttons currentNode={currentNode} storyTree={storyTree} /></div>
			
		</div>
	</div>);
};


const ScrollIntoView = ({watch}) => {
	const endRef = useRef();	
	// const scrollToBottom = () => {
		if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
	// };	
	// useEffect(scrollToBottom, [watch]);
	
	return <div ref={endRef} />;
};

const Buttons = ({currentNode, storyTree}) => {
	let text = currentNode.value && currentNode.value.text;
	if ( ! text) return "TODO";
	if (text[0]==="|")	{
		const i = text.indexOf("| ");
		let thenbit = i>0? text.substr(i+1).trim() : "";
		let choicebit = i>0? text.substr(0, i) : text;
		let choices = choicebit.split("|").filter(c => c);
		// TODO bump right to avoid accidental next clicks
		return choices.map(c => <Button className="ml-2 mr-2" color='primary' onClick={e => doChoice({currentNode, storyTree, c, thenbit})} key={c}>{c}</Button>);
	}
	return <Button color='primary' onClick={e => StoryTree.next(storyTree)} ><Emoji>✏️</Emoji> ... (space)</Button>;
};

const doChoice = ({currentNode, storyTree, c, thenbit}) => {	
	// TODO modify history not source
	currentNode.value.text = c;
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
	// Is it a test? handled in nextTest
	if (text[0]==='{') {
		return null;
	}
	// Is it dialogue? remove the emotion marker
	let m = text.match(rSpeech);
	if (m) {
		text = m[1]+': "'+m[3].trim()+'"';
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
