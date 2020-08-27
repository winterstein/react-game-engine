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
import { space, randomPick } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import ServerIO from '../base/plumbing/ServerIOBase';
import MDText from '../base/components/MDText';
import BG from '../base/components/BG';

let ticker = new StopWatch({tickLength:500});

const StoryPage = () => {

	let pvChapter = DataStore.fetch(['misc','chapter',1], () => {
		return ServerIO.load("/data/book/chapter1.md");
	});
	if ( ! pvChapter.value) return <Misc.Loading/>;

	let chapter = pvChapter.value;
	let _title = chapter.match(/^# (.+)$/m);
	let title = (_title && _title[1]) || "";
	// console.log(title);
	let sections = chapter.split(/^##\s+/m);
	// console.log(sections);
	let si = 1;
	let section = sections[si];
	// let scenes = section.split(/^###\s+/m);
	let scenes = section.split(/\n/g);
	let [sceneIndex, setSceneIndex] = useState(0);

	let tick = StopWatch.update(ticker);
	let [lastTick,setLastTick] = useState(tick);
	if (tick > lastTick) {
		setSceneIndex(sceneIndex + 1);
		setLastTick(tick);
	}
	setTimeout(() => DataStore.update(), 250);

	return (<div className='open-book container'>
		<BG src='/img/src/bg/open-book.jpg' size='fit' opacity={1}>
			<div className='right-page'>
				<h2><MDText source={title} /></h2>
				{scenes.map((s,i) => i > sceneIndex? null : <div key={i}><MDText source={s} /></div>)}
			</div>
		</BG>
	</div>);
};

export default StoryPage;
