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
import BG from './BG';
import ServerIO from '../base/plumbing/ServerIOBase';
import JSend from '../base/data/JSend';

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
		
		<PropControl label='He was' path={myAnswersPath} prop={0} />
		
		<PropControl label='She was' path={myAnswersPath} prop={1} />
		<PropControl label='They met' path={myAnswersPath} prop={2} />
		<PropControl label='He said' path={myAnswersPath} prop={3} />
		<PropControl label='She said' path={myAnswersPath} prop={4} />
		<PropControl label='As a consequence' path={myAnswersPath} prop={5} />
		<div>
			<Button disabled={imDone} onClick={e => setValue(statePath.concat(['done', myId]), true) && Room.sendRoomUpdate(room)} >I'm Done</Button>
			<div>Done: {Object.keys(dones).join(", ")}</div>
		</div>

	</div>);		
};


/**
 * @returns {string} The story!
 */
const makeStory = (answerSet) => {
	return "He was "+answerSet[0]+". She was "+answerSet[1]+". They met "+answerSet[2]+". He said "+answerSet[3]+". She said "+answerSet[4]+". As a consequence "+answerSet[5];
};


const ShowStories = ({room}) => {
	// alphabetical id sort, to give consistency between clients
	let mids = [...Room.memberIds(room)];
	mids.sort();

	let myi = mids.indexOf(getPeerId()) || 0;	
	myi = myi % room.state.story.length;

	let story = room.state.story[myi];

	// grab a backdrop?	
	let pvImg = DataStore.fetch(['misc','bg',room.id, 'story'+myi], () => {
		let q = room.state.bg[myi];
		return ServerIO.load('/unsplash', {data:{q, size:1}})
			.then(resp => {
				console.warn(resp);			
				let res = JSend.data(resp);			
				return res[0];	
			});
	});

	return (<div style={{fontSize:'150%'}}>
		<h2>Consequences Game</h2>
		{pvImg.value? <BG src={pvImg.value.urls && pvImg.value.urls.regular} /> : null}
		<h3>Story {myi+1} of {room.state.story.length}</h3>
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
	room.state.bg = {};
	for(let i=0; i<n; i++) {			
		let answerSet = [];
		for(let j=0; j<numQs; j++) {
			answerSet.push(answerArrays[(i+j) % numAnswerSets][j]);
		}
		let storyi = makeStory(answerSet);
		room.state.story[i] = storyi;
		room.state.bg[i] = answerSet[2];
	}
	room.state.done = true;
	Room.sendRoomUpdate(room);
};

const checkDone = (room, dones) => {
	if ( ! dones) return false;
	let dcnt = Object.values(dones).filter(d => d).length;
	if (dcnt === Room.memberIds(room).length) {
		return true;
	}
};

export default ConsequencesGame;
