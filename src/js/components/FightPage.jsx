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
import DataClass, { nonce } from '../base/data/DataClass';
import GameAdmin, {doNewWorld} from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Player from '../creatures/Player';


let rightClickDisabledFlag = false;

const FightPage = () => {
	
	// disable right-click to stop it interfering with the game. Use F12 to get the console
	if (false && ! rightClickDisabledFlag) {		
		document.addEventListener('contextmenu', event => event.preventDefault());
		rightClickDisabledFlag = true;
	}

	let world = "foo"; //DataStore.getUrlValue("world");
	let fight = DataStore.getValue("misc", "game", "fight");
	if ( ! fight) {
		fight = makeFight();
	}

	// check it has been loaded / inited
	let papp = getPApp();
	if ( ! papp) {
		papp = getPApp();
		assert(papp);
	}			

	return (<div style={{position:'relative', userSelect:"none", overflow:"hidden"}}>		
		<PixiComponent app={papp} />
	</div>);
};

const makeFight = () => {
	let fight = new Fight();
	fight.team = [
		{name:"Greg"},
		{name:"Alice"}
	];
	fight.enemies = [
		{name:"Angry Robot"},
		{name:"Nasty Robot"}
	];
	DataStore.setValue(["misc", "game","fight"], fight, false);
	return fight;
};

export default FightPage;
