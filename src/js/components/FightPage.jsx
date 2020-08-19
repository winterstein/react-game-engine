/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState } from 'react';
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
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce } from '../base/data/DataClass';
import GameAdmin, {doNewWorld} from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Fight from '../data/Fight';
import Monster from '../data/Monster';

import ReactVivus from 'react-vivus';
import { space } from '../base/utils/miscutils';
// import svg from '../img/angry-robot.svg';

const DrawReact = ({src, height="200px", width="200px"}) => {
	let [id] = useState(nonce(6));
	return (<ReactVivus
		id={id}
		option={{
			file: src,
			type: 'oneByOne',
			// animTimingFunction: 'EASE',
			duration: 70,
			onReady: console.log
		}}
		style={{height, width}}
		callback={console.log}
	/>);
};

let rightClickDisabledFlag = false;

let fight = null;

const FightPage = () => {
	
	// disable right-click to stop it interfering with the game. Use F12 to get the console
	if (false && ! rightClickDisabledFlag) {		
		document.addEventListener('contextmenu', event => event.preventDefault());
		rightClickDisabledFlag = true;
	}

	let world = "foo"; //DataStore.getUrlValue("world");
	fight = DataStore.getValue("misc", "game", "fight");
	if ( ! fight) {
		fight = makeFight();
	}
	let sprites = [...fight.team,...fight.enemies];	
	let activeSprite = sprites.find(s => s.id===fight.turn);
	let focalSprite = sprites.find(s => s.id===DataStore.getValue('focus','Sprite'));
	
	let target;
	if (Monster.isa(activeSprite)) {
		target = fight.team[0];
	} else {
		target = fight.enemies[0];
	}

	return (<div style={{position:'relative', userSelect:"none", overflow:"hidden"}}>		
		<Row>
			<Col>{fight.team.map(peep => <Peep key={peep.id} sprite={peep} selected={peep===activeSprite} />)}</Col>
			
			<Col>{fight.enemies.map(peep => <Enemy key={peep.id} sprite={peep} selected={peep===activeSprite} />)}</Col>
		</Row>
		<Row>
			{focalSprite? <Col>Focus: {focalSprite.name}</Col> : null}
		</Row>
		Turn: {fight.turn} 
		Active: {activeSprite.name}

		Options: 
		{activeSprite.spells && activeSprite.spells.map(spell => <ActionButton active={activeSprite} target={target} key={spell} action={spell} />)}
		<ActionButton action={'Guard'} active={activeSprite} />

	</div>);	
};

const ActionButton = ({action, active, target}) => <Button color='primary' className='mr-2' onClick={e => doAction({action, active, target})}>{action}</Button>;

const doAction = ({action, active, target}) => {
	action = action.toLowerCase();
	switch(action) {
	case "guard":
		console.log("guard = no-op");
		break;
	case "honey badger":
		console.warn("BADGER!!!");
		if (target) {
			target.health -= 20;
		}
		break;
	default:
		if (target) {
			target.health -= 10;
		}
		break;
	}
	console.warn(action);
	if (target && target.health < 0) {
		doDie(target);
	}
	doNextTurn();
};

const doDie = sprite => {

};

const doNextTurn = () => {
	let spriteIds = [...fight.team,...fight.enemies].map(s => s.id);	
	let i = spriteIds.indexOf(fight.turn);
	i = (i + 1) % spriteIds.length;
	fight.turn = spriteIds[i];
	DataStore.update();
};

const Peep = ({sprite, selected}) => {
	if (sprite.src && sprite.src.includes(".svg")) {
		return (<div onClick={e => setFocus(sprite)} className={space('peep', selected && "selected")}>
			{selected? <b>{sprite.name}</b> : sprite.name}
			<DrawReact src={sprite.src} />
			Health: {sprite.health}
		</div>);
	}
	return sprite.name;
};

const setFocus = sprite => DataStore.setValue(['focus','Sprite'], sprite.id);

const Enemy = ({sprite}) => <Peep sprite={sprite} />;

const makeFight = () => {
	let fight = new Fight();
	fight.team = [
		new Sprite({name:"Alice", src:"/img/src/alice.svg", spells:['Honey Badger', 'Rhino', 'Tiger', 'Bat'], health:100}),
		new Sprite({name:"Bob", src:"/img/src/bob.svg", spells:['Cobra', 'Alligator', 'Flying Snake'], health:100})
	];
	fight.enemies = [
		new Monster({name:"Angry Robot", src:"/img/src/angry-robot.svg", spells:['Laser Glare', 'Sonic Punch'], health:70}),
		// new Monster({name:"Nasty Robot"})
	];
	fight.turn = fight.team[0].id;
	DataStore.setValue(["misc", "game","fight"], fight, false);
	return fight;
};

export default FightPage;
