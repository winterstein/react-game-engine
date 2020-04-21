/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import C from '../C';
import Game, { doLoad } from '../Game';
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
import { Alert, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getPApp } from './Pixies';
import { nonce } from '../base/data/DataClass';
import {getPeerId, doJoin} from '../plumbing/peering';

const doNewWorld = () => {
	const game = Game.get();
	Game.init(game);
	game.id = getPeerId();
	let world = game.id;
	DataStore.setUrlValue("world", world);
	Game.setAutoSave(true);
	DataStore.setShow('admin', false);
};

const doLoadWorld = () => {
	let game = doLoad();
	Game.init(game);
	let world = game.id;
	DataStore.setUrlValue("world", world);
	Game.setAutoSave(true);
	DataStore.setShow('admin', false);
};

const PixiPage = () => {
	let world = DataStore.getUrlValue("world");
	if ( ! world) {
		doNewWorld();
		world = DataStore.getUrlValue("world");
	}
	const inGame = !! world;

	// check it has been loaded / inited
	let papp;
	if (inGame) {
		papp = getPApp();
		if ( ! papp) {
			let game = doLoad(world);
			Game.init(game);
			Game.setAutoSave(true);
			papp = getPApp();
			assert(papp);
		}		
	}
	// connect to remote?
	if (world !== getPeerId()) {
		doJoin(world);
	}
	
	return (<div style={{position:'relative', userSelect:"none"}}>
		<div className='portrait'>
			<Alert color='warning'>Please rotate your phone to landscape. Then reload this page.</Alert>
		</div>		
		{inGame? <PixiComponent app={papp} /> : null }
		<GameAdmin world={world} />		
	</div>);
};

const GameAdmin = ({world}) => {
	// pause game
	const showAdmin = DataStore.getShow('admin');	
	let ticker = Game.get().ticker;
	if (showAdmin && ! ticker.paused) StopWatch.pause(ticker);
	if ( ! showAdmin && ticker.paused) StopWatch.start(ticker);

	const toggle = () => DataStore.setShow('admin', ! showAdmin);

	return (<>
		<div style={{position:'fixed',top:0,right:'1vh',color:'#ccc',fontSize:'3vh'}} onClick={() => DataStore.setShow('admin', true)}>&#x2699;</div>
		<Modal isOpen={showAdmin}
			className="login-modal"
			toggle={toggle}
		>
			<ModalHeader toggle={toggle}>
				<Misc.Logo url={C.app.logo} transparent={false} className='pull-left m-r1' />{' '}{C.app.name}
			</ModalHeader>
			<ModalBody>							
				<div className='container'>
					<h4>This Device is known as: {getPeerId()}</h4>
					<h4>This World is known as: {world}</h4>
					<div><Button onClick={doNewWorld}>New World</Button></div>
					<div><Button onClick={doLoadWorld}>Load World</Button></div>
					<div className='form-inline'>
						<PropControl prop='join' path={['widget','admin']} />
						<Button onClick={doJoinWorld}>Join a Friends World</Button>
					</div>
				</div>
			</ModalBody>
		</Modal></>);
};

const doJoinWorld = () => {
	let world = DataStore.getValue('widget','admin','join');
	if ( ! world) return;
	DataStore.setUrlValue('world', world);
	DataStore.setShow('admin', false);
};

export default PixiPage;
