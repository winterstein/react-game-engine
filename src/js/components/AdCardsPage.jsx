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
import {Room,getPeerId,getCurrentRoom} from '../plumbing/peeringhack';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';
import { stopEvent, copyTextToClipboard, randomPick } from '../base/utils/miscutils';
import Messaging from '../base/plumbing/Messaging';
import BG from './BG';
import CGame from './ConsequencesGame';
import LobbyPage, { isInLobby, Peeps, Chatter } from './LobbyPage';
import AdCardsGame from './AdCardsGame';

// Game states: Name -> Create / Join -> Start -> Enter -> Deliver stories

const AdCardsPage = () => {
	let room = getCurrentRoom();
	if ( ! room || isInLobby(room)) {
		return (<LobbyPage title='Ads Without Humanity'>
			TODO game options - showCards
		</LobbyPage>);
	}
	if ( ! room.game) {
		// only setup once (the host)
		if ( ! Room.isHost(room)) {
			return <Misc.Loading />;
		}
		room.game = new AdCardsGame();
		room.game.playerIds = Room.memberIds(room);
		AdCardsGame.setup(room.game);
	}
	// my id
	let pid = getPeerId();
	let game = room.game;
	let clientMember = Room.member(room, game.client);
	const isClient = pid === game.client;
	const member = Room.member(room, pid);	
	return (<Container fluid>
		<Row>
			<Col>
				<h2>Card Game ON!</h2>				
				<h4>Client rep: {clientMember.name || game.client} {isClient? " - That's You!" : null}</h4>

				{isClient? <ClientView game={game} member={member} pid={pid} /> : null}
				{ ! isClient? <AdvertiserView game={game} member={member} pid={pid} /> : null}
				
			</Col>
			<Col>
				<Peeps room={room} />
				<Chatter room={room} />
			</Col>
		</Row>
		<div>Room: {room.id}, Host: {room.oid}</div>
	</Container>);
};

const WAIT_MSGS = [
	"Listen! That gurgling is the sound of creative juices flowing. Definitely not gin on a phone call.",
	"With passion and energy, the creatives set to work...",
];

const ClientView = ({game, member, pid}) => {
	const pickedCards = AdCardsGame.pickedCards(game);
	const allPicked = pickedCards.length >= game.playerIds.length - 1;
	if ( ! game.waitMsg) game.waitMsg = randomPick(WAIT_MSGS);
	return (<>
		<h3>Congratulations! You have just been made Chief Marketing Officer for</h3>
		<Card body color='primary'><h3>ACME {game.product}</h3></Card>

		{allPicked? 
			(game.options.showCards || game.readyToPick? 
				<><h4>Pick a winning slogan</h4><ClientChoiceHand game={game} member={member} pid={pid} hand={pickedCards} /></> 
				: <h4>Ask the Advertisers for their slogan pitches. Then click this button when you are <button type="button" >Ready to Choose the Winner</button></h4>)
			: <div>{game.waitMsg}</div>
		}
	
		<div><Button onClick={e => AdCardsGame.newRound(game)}>New Round</Button></div>

	</>);
};

const AdvertiserView = ({game,member,pid}) => {
	return (<>
		{game.options.showCards? <Card body color='primary'>ACME {game.product}</Card> : <h3>Ask the Client about the product</h3>}
	
		<YourHand member={member} game={game} pid={pid} />
	</>);
};


const YourHand = ({member, game, pid}) => {
	const hand = AdCardsGame.getHand(game, pid);
	let picked = game.playerState[pid].picked;
	if ( ! picked) member.answer = false;
	const pickCard = card => {
		game.playerState[pid].picked = card;
		member.answer = true;
	};
	return (<Row>
		{hand.map((card, i) => 
			<Col key={i} className='pt-5'>
				<Card body className={picked===card? 'mt-n5' : null} color='success' 
					onClick={e => pickCard(card)} >
					<h3>{card}</h3>
					<div style={{transform:"rotate(-180deg)"}}>{AdCardsGame.brandForSlogan(card)}</div>
				</Card>
			</Col>
		)}
	</Row>);
};

// copy pasta code :(
const ClientChoiceHand = ({hand, member, game, pid}) => {
	let picked = game.playerState[pid].picked;
	if ( ! picked) member.answer = false;
	const pickCard = card => {
		game.playerState[pid].picked = card;
		member.answer = true;
	};
	return (<Row>
		{hand.map((card, i) => 
			<Col key={i}>
				<Card body className={picked===card? 'mt-n5' : null} color='success' 
					onClick={e => pickCard(card)} ><h3>{card}</h3>
				</Card>
			</Col>
		)}
	</Row>);
};

export default AdCardsPage;
