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
			<Button disabled={imDone} onClick={e => setValue(statePath.concat(['done', myId]), true) && Room.sendRoomUpdate(room)} >I'm Done</Button>
			<div>Done: {Object.keys(dones).join(", ")}</div>
		</div>

	</div>);		
};


const ShowStories = ({room}) => {
	let myi = Room.memberIds(room).indexOf(getPeerId());
	// paranoia
	myi = myi % room.state.story.length;
	let story = room.state.story[myi];
	return (<div><h2>Story {myi+1} of {room.state.story.length}</h2>
		<div>{JSON.stringify(story)}</div>
	</div>);
};


const makeStories = room => {
	// make stories
	let n = Room.memberIds(room).length;
	room.state.story = [];
	let answerArrays = Object.values(room.state.answers);
	let numQs = answerArrays[0].length;	
	if (numQs===undefined) numQs = Object.keys(answerArrays[0]).length;	// e.g. {0:'Alan',1:'Betty'} instead of an array
	const numAnswerSets = answerArrays.length;
	for(let i=0; i<n; i++) {			
		let answerSet = [];
		for(let j=0; j<numQs; j++) {
			answerSet.push(answerArrays[(i+j) % numAnswerSets][j]);
		}
		let storyi = makeStory(answerSet);
		room.state.story[i] = storyi;
	}
	room.state.done = true;
	Room.sendRoomUpdate(room);
};

/**
 * 
 * @param {number} i person's index
 * @param {number} n people in the room
 * @param {*} answers 
 * @returns {string} The story!
 */
const makeStory = (answerSet) => {
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
