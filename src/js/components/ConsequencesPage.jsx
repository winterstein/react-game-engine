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
import { Alert, Button, Modal, ModalHeader, ModalBody, Card, CardBody } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce } from '../base/data/DataClass';
import {Room,getPeerId} from '../plumbing/peering';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';

// Game states: Name -> Create / Join -> Start -> Enter -> Deliver stories
let theRoom;

/**
 * @param {String} world
 */
const ConsequencesPage = () => {
	let wpath = ['misc','consequences'];
	let pid = getPeerId();	

	if ( ! theRoom) {
		return <Entrance />;
	}

	if ( ! theRoom.state.stage || theRoom.state.stage === 'open') {
		return <RoomOpen />;
	}

	return (<>
		Game On			
	</>);
};

const Entrance = () => {
	return (
	<><PropControl path={['misc','player']} prop='name' label='Your Name' />
			
		<Card>
			<CardBody>
				<PropControl prop='room' label='Room ID' />
				<Button onClick={joinRoom}>Join Room</Button>
			</CardBody>
		</Card>

		<Button onClick={createRoom}>Create Room</Button>

		Room: {JSON.stringify(theRoom)}
		</>);
};

const RoomOpen = ({roomId}) => {
	// onClick={e => doShare(e, this)
	return 	<><a data-sharetext='Join my goose' data-sharetitle='Join my goose'
	href={window.location} >Share {roomId}</a>

	<h2>{Room.isHost(theRoom)? "Host" : "Guest"}</h2>
	
	Room: {JSON.stringify(theRoom)}
	</>;
};

// HACK
setInterval(() => DataStore.update({}), 500);

const createRoom = () => {
	theRoom = Room.create();
};
const joinRoom = () => {
	let roomId = DataStore.getUrlValue('room');
	theRoom = Room.enter(roomId);
};


/**
 * 
 * @param {React.MouseEvent} e 
 * @param {*} $a 
 */
const doShare = (e,$a) => {
	if (navigator.share) {
		let shareUrl = $a.getAttribute('href');
		let shareTitle = $a.getAttribute('data-sharetitle');
		let shareText = $a.getAttribute('data-sharetext');
		navigator.share({url:shareUrl,title:shareTitle,text:shareText});
		e.stopPropagation();
		e.preventDefault();
	}
};

export default ConsequencesPage;
