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
import { space, randomPick } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
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
	let sprites = Fight.sprites(fight);
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

<pre>
Turn: {fight.turn} 
Active: {activeSprite.name}
</pre>
Commands: 
<ol>
	{Command._q.map((c,i) => <li key={i}>{Command.str(c)}</li>)}
</ol>


		Options: 
		{activeSprite.spells && activeSprite.spells.map(spell => <ActionButton active={activeSprite} target={target} key={spell} action={spell} />)}
		<ActionButton action={'Guard'} active={activeSprite} />

	</div>);	
};

const ActionButton = ({action, active, target}) => (<Button 
	color={Monster.isa(active)? (active.selectedAction===action? 'warning':'danger') : 'primary'} 
	className='mr-2' 
	onClick={e => doAction({action, active, target})}
	>{action}</Button>);




/************************************************************************************* */
/***********************************************************************************/

/**
 * 
 * @param {Command} command 
 */
Command.start = command => {
	console.log("start", Command.str(command));
	switch(command.verb) {
	case "+":
	case "set":
		command.before = command.subject[command.object];
		break;
	}
}; // ./start

/**
 * 
 * @param {Command} command 
 */
Command.finish = command => {
	console.log("finishing...", Command.str(command));
	switch(command.verb) {
	case "+":
		// avoid floating point issues from update
		command.subject[command.object] = command.before + command.value;
		break;
	case "set":
		command.subject[command.object] = command.value;
		break;
	case "attack":
		let action = command.subject.selectedAction;
		let targetId = command.subject.selectedTargetId;
		let target = fight.team.find(p => p.id === targetId);
		doAction({action, active:command.subject, target});
		break;
	case "check-state":
		Fight.sprites.forEach(sp => {
			if (sp.health > 0) return;
			cmd(sp, new Command("die"));
		});
		let alive = fight.enemies.filter(s => s.health > 0);
		if ( ! alive.length) {
			cmd(fight, new Command("win"));
		}
		break;
	}
	console.log("...finished", Command.str(command));
}; // ./finish

/**
 * 
 * @param {Command} command 
 */
Command.updateCommand = (command, dmsecs) => {
	const dfraction = dmsecs/command.duration;
	switch(command.verb) {
	case "+":
		// avoid floating point issues from update
		command.subject[command.object] = command.before + command.value * dfraction;
		break;
	case "pick":
		let n = command.value.length;
		let i = Math.round(dfraction * n * 2) % n;
		command.subject[command.object] = command.value[i];
		break;
	}	
}; // ./updateCommand

/************************************************************************************* */
/************************************************************************************* */


const doAction = ({action, active, target}) => {
	action = action.toLowerCase();
	switch(action) {
	case "guard":
		console.log("guard = no-op");
		break;
	case "honey badger":
		console.warn("BADGER!!!");
		if (target) {
			cmd(new Command(target, "+", "health", -50));
		}
		break;
	default:
		if (target) {
			cmd(new Command(target, "+", "health", -10));
		}
		break;
	}
	// check for death & victory / defeat after the health hit has taken effect
	cmd(new Command(fight, "check-state").setDuration(0));
	doNextTurn();
};


const doNextTurn = () => {
	let spriteIds = [...fight.team,...fight.enemies].map(s => s.id);	
	let i = spriteIds.indexOf(fight.turn);
	i = (i + 1) % spriteIds.length;
	let nextId = spriteIds[i];
	cmd(new Command(fight, "set", "turn", nextId, {duration:100}));

	// hack random attack
	let activeEnemy = fight.enemies.find(s => s.id===nextId);
	if (activeEnemy) {
		cmd(new Command(activeEnemy, "pick", "selectedTargetId", fight.team.map(p => p.id)));
		cmd(new Command(activeEnemy, "pick", "selectedAction", activeEnemy.spells));
		cmd(new Command(activeEnemy, "attack"));
	}
};

const Peep = ({sprite, selected}) => {
	if (sprite.src && sprite.src.includes(".svg")) {
		return (<div onClick={e => setFocus(sprite)} className={space('peep', selected && "selected")}
			style={{position:'relative',width:'200px'}}
			>
			{selected? <b>{sprite.name}</b> : sprite.name}
			<DrawReact src={sprite.src} />
			Health: {sprite.health}
			{sprite.health <= 0? <div style={{position:'absolute',bottom:0}}><DrawReact src={'/img/src/fire.svg'} /></div> : null}
		</div>);
	}
	return sprite.name;
};

const setFocus = sprite => DataStore.setValue(['focus','Sprite'], sprite.id);

const Enemy = ({sprite}) => <Peep sprite={sprite} />;

const makeFight = () => {
	// let game = Game.get(); game is tied to pixi which we aren't using
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

	// game loop
	// tick
	fight.ticker = new StopWatch();
	const ticker = fight.ticker;
	// // update loop - use request ani frame
	let gameLoop = () => {
		if (fight.isStopped) {
			return;
		}
		//Call this `gameLoop` function on the next screen refresh
		//(which happens 60 times per second)		
		requestAnimationFrame(gameLoop);		
		// tick
		let tick = StopWatch.update(ticker);
		if (tick) {
			Command.tick(tick);
			DataStore.update();
		}
	};	
	//Start the loop
	gameLoop();

	return fight;
};

export default FightPage;
