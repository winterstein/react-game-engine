/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore, { getValue } from '../base/plumbing/DataStore';
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
import {Room,getPeerId} from '../plumbing/peering';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';
import { stopEvent } from '../base/utils/miscutils';
import Messaging from '../base/plumbing/Messaging';

import CGame from './ConsequencesGame';
// Game states: Name -> Create / Join -> Start -> Enter -> Deliver stories

/**
 * @param {String} world
 */
const LobbyPage = () => {
	let wpath = ['misc','consequences'];
	let pid = getPeerId();	
	let join = DataStore.getUrlValue('join');
	let roomId = DataStore.getValue('misc','roomId');

	let room = roomId? DataStore.getValue('data','Room',roomId) : null;
	
	if ( ! room) {		
		if (join) {
			room = joinRoom(join);
		} else {
			return <Container><Entrance /></Container>;
		}
	}

	let Guts;
	if ( ! room.state || ! room.state.stage || room.state.stage === 'lobby') {
		Guts = <RoomOpen room={room} />;
	} else {
		Guts = <CGame room={room} />;
	}

	return (<Container>		
		<Row>
			<Col>{Guts}</Col>
			<Col>
				<Peeps room={room} />
				<Chatter room={room}/>
			</Col>
		</Row>
	</Container>);
};


const Entrance = () => {
	return (<>
		<PropControl path={['misc','player']} prop='name' label='Your Name' />	
		<Row>
			<Col>
				<Card>
					<CardBody>
						<PropControl prop='room' label='Room ID' />
						<Button onClick={() => joinRoom(DataStore.getUrlValue('room'))}>Join Room</Button>
					</CardBody>
				</Card>
			</Col>
			<Col>
				<Button onClick={createRoom}>Create Room</Button>
			</Col>
		</Row></>);
};

const RoomOpen = ({room}) => {
	const roomId = room.id;
	// onClick={e => doShare(e, this)
	return 	<>
	<h3><ShareLink room={room}>Share room {room.id}</ShareLink></h3>

	<h2>{Room.isHost(room)? "Host" : "Guest "+getPeerId()}</h2>
	
	
	{Room.isHost(room)? <Button className='m-2' onClick={e => doStart(room)}>Start Game!</Button> : null}
	</>;
};

const Peeps = ({room}) => {
	return (<Card><CardBody>
		<CardTitle><h3>People Here</h3></CardTitle>
		{room.memberIds.map(pid => <Peep key={pid} pid={pid} room={room}/>)}
	</CardBody></Card>);
};
const Peep = ({pid,room}) => {
	let m = room.members[pid] || {};
	return <div>{pid} {m.name}</div>;
};

const doStart = room => {
	room.state.stage = 'game';
	Room.sendStateUpdate(room, room.state);
};

const Chatter = ({room}) => {
	const doChat = e => {
		stopEvent(e);
		Room.sendChat(room, DataStore.getValue('misc','chat','text'));
		DataStore.setValue(['misc','chat','text'],null);
	};
	let chats = room.chats || [];
	return (<Card><CardBody>
		<CardTitle><h3>Chat</h3></CardTitle>
		{chats.map((c,i) => <div key={i}><small>{c.from}:</small> {c.text}</div>)}
		<Form inline onSubmit={doChat}>
			<PropControl path={['misc','chat']} prop='text' />
			<Button onClick={doChat} >Send</Button>
		</Form>
	</CardBody></Card>);
};

const ShareLink = ({room}) => {
	// let shareUrl = $a.getAttribute('href');
	// let shareTitle = $a.getAttribute('data-sharetitle');
	// let shareText = $a.getAttribute('data-sharetext');
	let href = window.location+"?join="+room.id;
	return <a href={href} >Share {room.id}</a>;
};

// HACK
setInterval(() => DataStore.update({}), 500);

const createRoom = () => {
	let theRoom = Room.create();
	let me = Room.member(theRoom, getPeerId()) || {};
	me.name = getValue('misc','player','name');
	DataStore.setValue(['data','Room', theRoom.id], theRoom);
	DataStore.setValue(['misc','roomId'], theRoom.id);
};
const joinRoom = (roomId) => {
	if ( ! roomId) {
		Messaging.notifyUser("Please enter a Room ID");
		return;
	}
	let theRoom = Room.enter(roomId);
	
	// set your name
	let me = Room.member(theRoom, getPeerId()) || {};
	me.name = getValue('misc','player','name');	
	if (me.name) Room.sendRoomUpdate(theRoom);

	DataStore.setValue(['data','Room', theRoom.id], theRoom, false);
	DataStore.setValue(['misc','roomId'], theRoom.id, false);
	return theRoom;
};

export default LobbyPage;
