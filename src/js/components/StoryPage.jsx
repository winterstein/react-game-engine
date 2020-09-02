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
import { space, randomPick, asNum } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import ServerIO from '../base/plumbing/ServerIOBase';
import MDText from '../base/components/MDText';
import BG from '../base/components/BG';
import Tree from '../base/data/Tree';


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
			let tSection = Tree.add(this.root, {index:""+i});
			let scenes = section.split(/^###\s/m);
			scenes.forEach((scene,j) => {
				let tScene = Tree.add(tSection, {index:i+"."+j});
				let sentences = scene.split(/\n *\n/);
				sentences.forEach((sentence,k) => {
					sentence = sentence.trim();
					if ( ! sentence) return; // skip blank lines
					let tSentence = Tree.add(tScene, {index:i+"."+j+"."+k, id:nonce(),text:sentence});
					this.tSentence4id[tSentence.value.id] = tSentence;
				});
			});
		});
		Tree.add(this.history, this.root.value);
	}
};
/**
 * 
 * @param {StoryTree} storyTree 
 * @returns {Tree}
 */
StoryTree.next = storyTree => {
	// what comes next? find latest then step on
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 
	Tree.assIsa(last);
	let nodes = Tree.flatten(storyTree.root);
	let nextNode;
	for(let i=0; i<nodes.length; i++) {
		if (nodes[i].value === last.value) {
			nextNode = nodes[i+1];
			break;
		}
	}
	if ( ! nextNode) {
		// all done
		return null;
	}
	// add to history
	Tree.add(storyTree.history, nextNode.value);
	// return
	return nextNode;
};
Bookmark.show = (bookmark, level, i) => {
	let sss = Bookmark.sss(bookmark);
	return sss[level] >= i;
};

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
	let bookmark = DataStore.getUrlValue('bookmark') || DataStore.setUrlValue('bookmark', "", false);


	setTimeout(() => DataStore.update(), 500);	

	return (<div className='open-book container'>
		<BG src='/img/src/bg/open-book.jpg' size='fit' opacity={1}>
			<div className='right-page'>				
				{Tree.flatten(storyTree.history).map((t,i) => <StoryLine key={i} node={t} />)}
				<hr/>
								
				<Button color='primary' onClick={e => StoryTree.next(storyTree)} ><Emoji>✏️</Emoji> ... </Button>

			</div>
		</BG>
	</div>);
};

<<<<<<< HEAD
const Section = ({section, sectionIndex, bookmark}) => {
	let scenes = Bookmark.scenes(section);
	return <div>{scenes.map((s,j) => Bookmark.show(bookmark, 1, j)? <Scene key={j} scene={s} sectionIndex={sectionIndex} sceneIndex={j} bookmark={bookmark} /> : bookmark)}<hr/></div>;
=======
const StoryLine = ({node}) => {
	return <div key={i}>{node.value? <MDText source={node.value.text || ""+node.value.index} /> : "-"}</div>;
>>>>>>> feature/tree-chapter
};

// const Section = ({section, sectionIndex, bookmark}) => {
// 	let scenes = Bookmark.scenes(section);
// 	return <div>{scenes.map((s,j) => <Scene key={j} scene={s} sectionIndex={sectionIndex} sceneIndex={j} bookmark={bookmark} />)}<hr/></div>;
// };

<<<<<<< HEAD
const Scene = ({scene, sectionIndex, sceneIndex, bookmark}) => {
	let sentences = Bookmark.sentences(scene);
	return <div>{sentences.map((s,i) => Bookmark.show(bookmark, 2, i)? <Sentence key={i} sentenceIndex={i} text={s} sceneIndex={sceneIndex} sectionIndex={sectionIndex} bookmark={bookmark} /> : bookmark)}</div>;
};

const Sentence = ({text, sentenceIndex, sceneIndex, sectionIndex, bookmark}) => {
	let isLatest = Bookmark.isLatestSentence(bookmark, [sectionIndex, sceneIndex, sentenceIndex]);
	return (<div>{sectionIndex}.{sceneIndex}.{sentenceIndex}: 
		<MDText source={text} /> 
		{isLatest? <Button onClick={e => Bookmark.next(bookmark)}>...</Button> : null}
	</div>);
};
=======

// const Scene = ({scene, sectionIndex, sceneIndex, bookmark}) => {
// 	let sentences = Bookmark.sentences(scene);
// 	return <div>{sentences.map((s,i) => <Sentence key={i} sentenceIndex={i} text={s} sceneIndex={sceneIndex} sectionIndex={sectionIndex} bookmark={bookmark} />)}</div>;
// };

// const Sentence = ({text, sentenceIndex, sceneIndex, sectionIndex, bookmark}) => {
// 	let isLatest = [sectionIndex, sceneIndex, sentenceIndex].join('.') === bookmark;
// 	return <div>{sectionIndex}.{sceneIndex}.{sentenceIndex}: <MDText source={text} /> {isLatest}</div>;
// };
>>>>>>> feature/tree-chapter

export default StoryPage;
