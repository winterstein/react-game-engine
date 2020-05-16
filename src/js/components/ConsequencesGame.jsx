/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore, { getValue, setValue } from '../base/plumbing/DataStore';
import C from '../C';
import Game, { doLoad, doSave, doReset } from '../Game';
import _setup from '../game-setup';
import _update from '../game-update';
import Misc from '../base/components/Misc';
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import PropControl, { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from '../Key';
import { Alert, Button, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Container, Form, CardTitle } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce } from '../base/data/DataClass';
import {Room,getPeerId} from '../plumbing/peeringhack';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';
import { stopEvent } from '../base/utils/miscutils';


const ConsequencesGame = ({room}) => {	
	let myId = getPeerId();
	const statePath = ['data','Room',room.id,'state'];
	
	let dones = getValue(statePath.concat('done')) || {};
	let myAnswersPath = statePath.concat(['answers', myId]);
	let myAnswers = getValue(myAnswersPath);

	const imDone = dones[myId];

	// All done??
	if (Room.isHost(room)) {
		let done = checkDone(room, dones);		
		if (done) {
			makeStories(room);
		}
	}
	if (room.state.story) {
		return <ShowStories room={room} />;
	}

	return (<div>
		<h2>Consequences Game</h2>
		
		<div>
			<PropControl label='He was' path={myAnswersPath} prop={0} />
		</div>
		<div>
			<PropControl label='She was' path={myAnswersPath} prop={1} />
		</div>

		TODO

		<div>
			<Button onClick={e => setValue(statePath.concat(['done', myId]), true) && Room.sendRoomUpdate(room)} >I'm Done</Button>
			<div>Done: {JSON.stringify(dones)}</div>
		</div>

	</div>);		
};


const ShowStories = ({room}) => {
	return (<div><h2>The Stories</h2>
		{room.state.story.map((s,i) => <div key={i}>{JSON.stringify(s)}</div>)}
	</div>);
};


const makeStories = room => {
	// make stories
	let n = Room.memberIds(room).length;
	room.state.story = [];
	for(let i=0; i<n; i++) {		
		let storyi = makeStory(i, n, room.state.answers);
		room.state.story[i] = storyi;
	}
	room.state.done = true;
	Room.sendRoomUpdate(room);
};

const makeStory = (i, n, answers) => {
	let answerArrays = Object.values(answers);
	let answerSet = [answerArrays[i % n][0], answerArrays[(i+1) % n][1]];
	return "He was "+answerSet[0]+". She was "+answerSet[1];
};

const checkDone = (room, dones) => {
	if ( ! dones) return false;
	let dcnt = Object.values(dones).filter(d => d).length;
	if (dcnt === Room.memberIds(room).length) {
		return true;
	}
};

export default ConsequencesGame;
