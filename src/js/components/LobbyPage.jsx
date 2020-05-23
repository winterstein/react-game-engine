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
import {Room,getPeerId} from '../plumbing/peeringhack';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';
import { stopEvent, copyTextToClipboard } from '../base/utils/miscutils';
import Messaging from '../base/plumbing/Messaging';
import BG from './BG';
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
		return <BG src='/img/lobby.jpg'><Container><Entrance join={join} /></Container></BG>;
	}

	let bg = '/img/lobby.jpg';
	let Guts;
	if ( ! room.state || ! room.state.stage || room.state.stage === 'lobby') {
		Guts = <RoomOpen room={room} />;
	} else {
		// game on
		bg = '/img/paper-texture.jpg';
		Guts = <CGame room={room} />;
	}

	return (<BG src={bg}><Container>		
		<Row>
			<Col>{Guts}</Col>
			<Col>
				<Peeps room={room} />
				<Chatter room={room}/>
			</Col>
		</Row>
	</Container></BG>);
};


const Entrance = ({join}) => {
	if (join) {
		DataStore.setValue(['widget','Lobby','room'], join);
	}
	
	return (<>
		<Card body className='mt-2 mb-2'><PropControl path={['misc','player']} prop='name' label='Your Name' /></Card>
		<Row>
			<Col>
				<Card body>
					<CardTitle>Join a Room</CardTitle>
					<PropControl path={['widget','Lobby']} prop='room' label='Room ID' />
					<Button onClick={() => joinRoom(join || DataStore.getValue('widget','Lobby','room'))}>Join</Button>
				</Card>
			</Col>
			<Col>
				{join? null : <Card body><CardTitle>Create a New Room</CardTitle><Button onClick={createRoom}>Create</Button></Card>}
			</Col>
		</Row></>);
};

const RoomOpen = ({room}) => {
	const roomId = room.id;
	// onClick={e => doShare(e, this)
	return 	<Card body className='m-2'>
	<h3><ShareLink room={room}>Room: {room.id}</ShareLink></h3>

	<h2>{Room.isHost(room)? "Host" : "Guest "+getPeerId()}</h2>
		
	{Room.isHost(room)? <Button className='m-2' onClick={e => doStart(room)}>Everybody's In? - Let's Start!</Button> : null}
	</Card>;
};

const Peeps = ({room}) => {
	return (<Card><CardBody>
		<CardTitle><h3>People Here</h3></CardTitle>
		{Room.memberIds(room).map(pid => <Peep key={pid} pid={pid} room={room}/>)}
	</CardBody></Card>);
};
const Peep = ({pid,room}) => {
	let m = Room.member(room, pid);
	return <div>{m.name || pid}&nbsp;
		{m.connection? <span role='img' aria-label=':)' className='text-success'>&#x1F603;</span> : <><span role='img' aria-label=':(' className='text-danger'>&#x1F626;</span> lost connection</>}
	</div>;
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
	let chats = Room.chats(room);
	return (<Card><CardBody>
		<CardTitle><h3>Chat</h3></CardTitle>
		{chats.map((c,i) => <Chat key={i} room={room} chat={c} />)}
		<Form inline onSubmit={doChat}>
			<PropControl path={['misc','chat']} prop='text' />
			<Button onClick={doChat} disabled={ ! DataStore.getValue('misc','chat')} >Send</Button>
		</Form>		
	</CardBody></Card>);
			// <video style={{width:'50px',height:'50px'}}/>
			// <Button onClick={e => Room.call(room)}>Call</Button>	
};

const Chat = ({room, chat}) => {
	let m = Room.member(room, chat.from);
	return <div ><small>{m.name}:</small> {chat.text}</div>;
};

const ShareLink = ({room}) => {
	// let shareUrl = $a.getAttribute('href');
	// let shareTitle = $a.getAttribute('data-sharetitle');
	// let shareText = $a.getAttribute('data-sharetext');
	let u = window.location;
	let href = u+"?join="+room.id;
	return <><a href={href} target='_blank' >Share {room.id}</a><Button className='ml-1' size='sm' onClick={e => copyTextToClipboard(href)}>copy link to clipboard</Button></>;
};

// HACK
setInterval(() => DataStore.update({}), 500);

const getName = () => getValue('misc','player','name');

const createRoom = () => {
	let theRoom = Room.create();
	let me = Room.member(theRoom, getPeerId()) || {};
	me.name = getName();
	DataStore.setValue(['data','Room', theRoom.id], theRoom);
	DataStore.setValue(['misc','roomId'], theRoom.id);
};
const joinRoom = (roomId) => {
	if ( ! roomId) {
		Messaging.notifyUser("Please enter a Room ID");
		return;
	}
	
	// set your name
	let user = Login.getUser() || {};
	user.name = getName();

	let theRoom = Room.enter(roomId, user);
	
	DataStore.setValue(['data','Room', theRoom.id], theRoom, false);
	DataStore.setValue(['misc','roomId'], theRoom.id, false);
	return theRoom;
};

export default LobbyPage;
