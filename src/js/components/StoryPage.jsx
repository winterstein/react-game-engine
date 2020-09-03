/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState } from 'react';
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
import ChatLine from './ChatLine';
import deepCopy from '../base/utils/deepCopy';


let ticker = new StopWatch({tickLength:700});
const spaceKey = new Key(" ");

class StoryTree {
	/**
	 * @type {Tree} Never null
	 */
	history;

	constructor(text) {
		this.text = text;
		this.root = new Tree({value:"root"});
		this.history = new Tree();		
		this.tSentence4id = {};
		let sections = text.split(/^##\s/m);
		sections.forEach((section,i) => {
			let tSection = Tree.add(this.root, {id:nonce(), index:""+i});
			let scenes = section.split(/^###\s/m);
			scenes.forEach((scene,j) => {
				let tScene = Tree.add(tSection, {id:nonce(), index:i+"."+j});
				// branches for local dialog variants
				let twigs = scene.split(/^####\s/m);
				twigs.forEach((twig,b) => {
					// NB the 1st twig is probably "pre-twigging"
					let twigi = i+"."+j+(b? "."+("abcdefgh"[b-1]) : "");
					let tTwig = Tree.add(tScene, {id:nonce(), index:twigi});
					let sentences = twig.split(/\n *\n/);
					sentences.forEach((sentence,k) => {
						sentence = sentence.trim();
						if ( ! sentence) return; // skip blank lines
						let tSentence = Tree.add(tTwig, {index:twigi+"."+k, id:nonce(), text:sentence});
						this.tSentence4id[tSentence.value.id] = tSentence;
					});
				}); // ./twigs
			});
		}); // ./sections
		Tree.add(this.history, this.root.value);
	}
} // ./StoryTree

/**
 * 
 * @param {StoryTree} storyTree 
 * @returns {Tree} in root
 */
StoryTree.next = storyTree => {
	// what comes next? find latest then step on
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 
	Tree.assIsa(last);
	let nodes = Tree.flatten(storyTree.root);
	let nextNode;
	for(let i=0; i<nodes.length; i++) {
		if (nodes[i].value && last.value && nodes[i].value.id === last.value.id) {
			nextNode = nodes[i+1];
			break;
		}
	}
	if ( ! nextNode) {
		// all done
		return null;
	}
	// shallow copy the node, so e.g. we can edit choices
	let nextNodeValue = Object.assign({}, nextNode.value);
	// skip this node?
	if (nextNodeValue.text && nextNodeValue.text[0] === "{") {
		let ok = nextTest(nextNodeValue.text);
		if ( ! ok) {
			console.warn("TODO skip", nextNode);
		}
	}
	// add to history
	Tree.add(storyTree.history, nextNodeValue);
	// return
	return nextNode;
};
const nextTest = test => {
	let m = test.match("{if (.+)}");
	let test2 = m && m[1];
	if ( ! test2) {
		console.warn("nextTest - no test?! "+test);
		return true;
	}
	// HACK inventory check?
	let m2 = test2.match("(\\w+) in inventory");
	if (m2 && m2[1]) {
		const inventory = Game.getInventory(Game.get());
		let haveit = inventory[m2[1]];
		if (haveit) console.log("nextTest: yes! "+test);
		return !! haveit;
	}
	return true;
};
window.nextTest = nextTest; // debug

StoryTree.current = storyTree => {
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 
	return last;
};


const Emoji = ({children}) => <span aria-label='emoji' role='img'>{children}</span>;

const StoryPage = () => {
	const chapterNum = 1;
	let pvChapter = DataStore.fetch(['misc','chapter',chapterNum], () => {
		return ServerIO.load("/data/book/chapter-test.md");
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
	while(currentNode && ! (currentNode.value && currentNode.value.text)) {
		currentNode = StoryTree.next(storyTree);
	}

	setTimeout(() => DataStore.update(), 500);	
	
	return (<div className='open-book container'>
		<BG src='/img/src/bg/open-book.jpg' size='fit' opacity={1} height='100vh'>
			<div className='right-page'>				
				{Tree.flatten(storyTree.history).map((t,i) => <StoryLine key={i} node={t} />)}

				<hr/>
				<Buttons currentNode={currentNode} storyTree={storyTree} />
			</div>
		</BG>
	</div>);
};

const Buttons = ({currentNode, storyTree}) => {
	let text = currentNode.value && currentNode.value.text;
	if ( ! text) return "TODO";
	if (text[0]==="|")	{
		const i = text.indexOf("| ");
		let thenbit = text.substr(i+1).trim();
		let choices = text.substr(0, i).split("|").filter(c => c);
		return choices.map(c => <Button color='primary' onClick={e => doChoice({currentNode, storyTree, c, thenbit})} key={c}>{c}</Button>);
	}
	return <Button color='primary' onClick={e => StoryTree.next(storyTree)} ><Emoji>✏️</Emoji> ... </Button>;
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

const StoryLine = ({node}) => {
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
	// Is it dialogue?
	if (text.match(/^[a-zA-Z0-9 ]+:/)) {
		return <ChatLine line={text} />;
	}
	// spot scenes
	let se = substr(node.value.index, -2);
	if (se === ".0" && text[0] !== '#') {
		text = "## "+text;
	}	
	return <MDText source={text} />;
};


export default StoryPage;
