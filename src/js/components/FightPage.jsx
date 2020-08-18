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
import Fight from '../data/Fight';
import Monster from '../data/Monster';


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
	let activeSprite = fight.team.find(s => s.id===fight.turn) || fight.enemies.find(s => s.id===fight.turn);

	return (<div style={{position:'relative', userSelect:"none", overflow:"hidden"}}>		
		{fight.team.map(peep => <Peep key={peep.id} sprite={peep} />)}

		{fight.enemies.map(peep => <Enemy key={peep.id} sprite={peep} />)}

		Turn: {fight.turn}
		Active: {activeSprite.name}

		Options:
		{activeSprite.spells && activeSprite.spells.map(spell => spell)}
		Guard		
	</div>);
};

const Peep = ({sprite}) => {
	return sprite.name;
};

const Enemy = ({sprite}) => <Peep sprite={sprite} />;

const makeFight = () => {
	let fight = new Fight();
	fight.team = [
		new Sprite({name:"Alice", spells:['Honey Badger', 'Rhino', 'Tiger', 'Bat']}),
		new Sprite({name:"Bob"})
	];
	fight.enemies = [
		new Monster({name:"Angry Robot"}),
		new Monster({name:"Nasty Robot"})
	];
	fight.turn = fight.team[0].id;
	DataStore.setValue(["misc", "game","fight"], fight, false);
	return fight;
};

export default FightPage;
