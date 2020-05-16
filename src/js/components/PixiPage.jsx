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
import { Alert, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getPApp } from './Pixies';
import { nonce } from '../base/data/DataClass';
import GameAdmin, {doNewWorld} from './GameAdmin';


let rightClickDisabledFlag = false;

const PixiPage = () => {
	
	// disable right-click to stop it interfering with the game. Use F12 to get the console
	if ( ! rightClickDisabledFlag) {		
		document.addEventListener('contextmenu', event => event.preventDefault());
		rightClickDisabledFlag = true;
	}

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
			papp = getPApp();
			assert(papp);
		}		
	}
	return (<div style={{position:'relative', userSelect:"none", overflow:"hidden"}}>
		<div className='portrait'>
			<Alert color='warning'>Please rotate your phone to landscape. Then reload this page.</Alert>
		</div>		
		{inGame? <PixiComponent app={papp} /> : null }
		<GameAdmin world={world} />		
	</div>);
};

export default PixiPage;
