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
import ChatLine, { splitLine, ChatControls } from './ChatLine';
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

const StoryPage = () => {
	let chapterFile = DataStore.getUrlValue('chapter') || 'chapter1';
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

	// let bookmark = DataStore.getUrlValue('bookmark') || DataStore.setUrlValue('bookmark', "", false);
	// if (bookmark) { TODO fast forward for ease of testing (but not playing 'cos game state, e.g. you picked Dinosaur)
	// 	StoryTree.
	// }

	// get a text node
	let currentNode = StoryTree.current(storyTree);
	currentNode = StoryTree.nextToText(storyTree, currentNode);
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
				<ScrollIntoView watch={seenNodes.length+lastText} />
			</div>
			
			{splitLine(currentText) && <ChatLine line={currentText} />}
			<ChatControls currentNode={currentNode} storyTree={storyTree} />
			
		</div>
	</div>);
};

/**
 * @param {?boolean} once Only scroll once. It is a good idea to set this _or_ `watch`, but not both.
 * @param {?string} watch Scroll again if this changes. You cannot set this and `once`.
 */
const ScrollIntoView = ({once, watch, top=false}) => {
	const endRef = useRef();	
	assert( ! (once && watch));
	if (once) watch = "once";	
	let [done, setDone] = useState();			
	if (endRef.current) {
		// do once to allow the user to scroll away?
		if ( ! done || done !== watch) {
			endRef.current.scrollIntoView(top);
			setDone(watch);
		}		
	}
	return <div ref={endRef} />;
};

/**
 * HACK to do scroll once with write-in
 */
let lastText;

// TODO <Writing> based on <Counter />

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
	let mDialogue = splitLine(text);
	if (mDialogue) {
		// return null;
		text = mDialogue.label+': "'+mDialogue.said+'"';
	}
	// spot scenes
	let se = substr(node.value.index, -2);
	if (se === ".0" && text[0] !== '#') {
		text = "## "+text;
	}
	// one word at a time (but not for dialogue as that'd distract from the popup, or images)
	if (isLatest && ! mDialogue && text[0] !== '!' && text[0] !== '<') {
		let [stopWatch] = useState(new StopWatch());
		StopWatch.update(stopWatch);
		let dt = StopWatch.time(stopWatch);
		let nw = Math.round(dt / 25);
		text = text.substr(0,nw); //words.join(" ");
		// avoid half styling 
		text = text.replace(/[~*]+(\w+)$/,"$1");		
	}
	// HACK for scroll-into-view once
	if (isLatest) lastText = text;	

	return <MDText source={text} />;
};


export default StoryPage;
