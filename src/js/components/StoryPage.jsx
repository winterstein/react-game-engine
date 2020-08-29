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

/**
 * e.g. 1.0.2-nonce
 */
class Bookmark {
}
Bookmark.make = chapterText => {
	let _nonce = nonce();
	DataStore.setValue(["misc","bookmark",_nonce], chapterText);
	return "0.0.0-"+_nonce;
};
Bookmark.sections = chapterText => chapterText.split(/^##\s+/m);
Bookmark.scenes = section => section.split(/^###\s+/m);	
Bookmark.sentences = scene => scene.split(/\n *\n/);
Bookmark.isLatestSentence = (bookmark, sss) => {	
	let max = Bookmark.maxSentence(bookmark);
	return sss[2] === max;
};
Bookmark.maxSentence = () => {

};
Bookmark.sss = bookmark => bookmark? bookmark.split("-")[0].split(".").map(i => asNum(i)) : [0,0,0];
Bookmark.next = (bookmark) => {
	let sss = Bookmark.sss(bookmark);
	let _nonce = bookmark.split("-")[1];
	let chapterText = DataClass.getValue(["misc","bookmark",_nonce]);
	let sections = Bookmark.sections(chapterText);
	let scenes = Bookmark.scenes(sections[sss[0]]);
	let sentences = Bookmark.sentences(scenes[sss[1]]);
	console.log("next",sss,sections,scenes,sentences);
};
Bookmark.show = (bookmark, level, i) => {
	let sss = Bookmark.sss(bookmark);
	return sss[level] >= i;
};

let ticker = new StopWatch({tickLength:700});
const spaceKey = new Key(" ");

const StoryPage = () => {

	let pvChapter = DataStore.fetch(['misc','chapter',1], () => {
		return ServerIO.load("/data/book/chapter1.md");
	});
	if ( ! pvChapter.value) return <Misc.Loading/>;

	let chapter = pvChapter.value;
	let _title = chapter.match(/^# (.+)$/m);
	let title = (_title && _title[1]) || "";
	
	let bookmark = DataStore.getUrlValue('bookmark');
	if ( ! bookmark) {
		bookmark = Bookmark.make(chapter);
		DataStore.setUrlValue('bookmark', bookmark, false);
	}
	setTimeout(() => DataStore.update(), 500);
	let sections = Bookmark.sections(chapter);

	return (<div className='open-book container'>
		<BG src='/img/src/bg/open-book.jpg' size='fit' opacity={1}>
			<div className='right-page'>
				{sections.map((s,i) => Bookmark.show(bookmark, 0, i)? <Section key={i} section={s} sectionIndex={i} bookmark={bookmark} /> : bookmark)}
			</div>
		</BG>
	</div>);
};

const Section = ({section, sectionIndex, bookmark}) => {
	let scenes = Bookmark.scenes(section);
	return <div>{scenes.map((s,j) => Bookmark.show(bookmark, 1, j)? <Scene key={j} scene={s} sectionIndex={sectionIndex} sceneIndex={j} bookmark={bookmark} /> : bookmark)}<hr/></div>;
};


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

export default StoryPage;
