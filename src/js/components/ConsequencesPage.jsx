/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
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
import { Alert, Button, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Container, Form } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce } from '../base/data/DataClass';
import {Room,getPeerId} from '../plumbing/peering';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';

// Game states: Name -> Create / Join -> Start -> Enter -> Deliver stories

/**
 * @param {String} world
 */
const ConsequencesPage = () => {
	let wpath = ['misc','consequences'];
	let pid = getPeerId();	
	let join = DataStore.getUrlValue('join');
	let roomId = DataStore.getValue('misc','roomId');

	let theRoom = roomId? DataStore.getValue('data','Room',roomId) : null;

	if ( ! theRoom) {		
		if (join) {
			theRoom = joinRoom(join);
		} else {
			return <Container><Entrance /></Container>;
		}
	}

	if ( ! theRoom.state || ! theRoom.state.stage || theRoom.state.stage === 'lobby') {
		return <Container><RoomOpen room={theRoom} /></Container>;
	}

	return (<>
		Game On			
	</>);
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

	<Chatter room={room} />

	Room: {JSON.stringify(room)}
	</>;
};

const Chatter = ({room}) => {
	let chats = room.chats || [];
	return (<Card><CardBody>
		{chats.map((c,i) => <div key={i}><small>{c.from}:</small> {c.text}</div>)}
	<Form inline >
		<PropControl path={['misc','chat']} prop='text' />
		<Button onClick={() => {
			Room.sendChat(room, DataStore.getValue('misc','chat','text'));
			DataStore.setValue(['misc','chat','text'],null);
		}} >Send</Button>
	</Form>
	</CardBody></Card>);
};

const ShareLink = (room) => {
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
	DataStore.setValue(['data','Room', theRoom.id], theRoom);
	DataStore.setValue(['misc','roomId'], theRoom.id);
};
const joinRoom = (roomId) => {
	let theRoom = Room.enter(roomId);
	DataStore.setValue(['data','Room', theRoom.id], theRoom, false);
	DataStore.setValue(['misc','roomId'], theRoom.id, false);
	return theRoom;
};

export default ConsequencesPage;
