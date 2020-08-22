/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Enum from 'easy-enums';
import _ from 'lodash';
import SJTest, { assert } from 'sjtest';
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
import Key, { KEYS } from '../Key';
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col, Card, CardTitle } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import GameAdmin, { doNewWorld } from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Fight from '../data/Fight';
import Monster from '../data/Monster';

import ReactVivus from 'react-vivus';
import { space, randomPick } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
// import svg from '../img/angry-robot.svg';

const DrawReact = ({ src, height = "200px", width = "200px" }) => {
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
		style={{ height, width }}
		callback={console.log}
	/>);
};

let rightClickDisabledFlag = false;

let fight = null;

const FightPage = () => {

	// disable right-click to stop it interfering with the game. Use F12 to get the console
	if (false && !rightClickDisabledFlag) {
		document.addEventListener('contextmenu', event => event.preventDefault());
		rightClickDisabledFlag = true;
	}

	let world = "foo"; //DataStore.getUrlValue("world");
	fight = DataStore.getValue("misc", "game", "fight");
	if (!fight) {
		fight = makeFight();
	}
	let sprites = Fight.sprites(fight);
	let activeSprite = sprites.find(s => s.id === fight.turn);
	let focalSprite = sprites.find(s => s.id === DataStore.getValue('focus', 'Sprite'));

	let target;
	if (Monster.isa(activeSprite)) {
		target = fight.team[0];
	} else {
		target = fight.enemies[0];
	}
	let c0 = Command.peek();
	let badger = SpriteLib.badger();
	badger.x = 200; badger.y = 200;

	return (<div style={{ position: 'relative', userSelect: "none", overflow: "hidden" }}>
		<div className="position-relative" style={{ width: '100vw', height: '70vh' }}>
			{fight.team.map(peep => <Peep key={peep.id} sprite={peep} selected={peep === activeSprite} />)}

			{fight.enemies.map(peep => <Enemy key={peep.id} sprite={peep} selected={peep === activeSprite} />)}

			{c0 && c0.carrier ? <ImgSprite sprite={c0.carrier} /> : null}
		</div>
		<div>
			{focalSprite ? (<Card body><CardTitle>{focalSprite.name}</CardTitle>
				{focalSprite.affinity ? <h3>{EMOJI[focalSprite.affinity]}</h3> : null}
				{focalSprite.affinities ? <table><tbody>
					<tr>{KAffinity.values.map(a => <td key={a}>{EMOJI[a]}</td>)}</tr>
					<tr>{KAffinity.values.map(a => <td key={a}>{focalSprite.affinities[a] || '-'}</td>)}</tr>
				</tbody></table>
					: null}
			</Card>) : null}
		</div>

		<pre>
			Active: {activeSprite && activeSprite.name}
		</pre>				

		Options:
		{activeSprite && activeSprite.spells && activeSprite.spells.map(spell => <ActionButton active={activeSprite} target={target} key={spell} action={spell} />)}
		<ActionButton action={'Guard'} active={activeSprite} />

		<div><small>Commands:
			<ol>
				{Command._q.map((c, i) => <li key={i}>{Command.str(c)}</li>)}
			</ol>
		</small></div>

	</div>);
};

const ImgSprite = ({ sprite }) => {
	return (<div style={{ position: "absolute", top: sprite.y, left: sprite.x, width:sprite.src?'48px':null, height: '48px', overflow: "hidden" }}>
		{sprite.src? <img src={sprite.src} /> : (sprite.label || sprite.name || getType(sprite) || sprite.id)}</div>);
};

const ActionButton = ({ action, active, target }) => (<Button
	color={Monster.isa(active) ? (active.selectedAction === action ? 'warning' : 'danger') : 'primary'}
	className='mr-2'
	onClick={e => doAction({ action, active, target })}
>{action}</Button>);




/************************************************************************************* */
/***********************************************************************************/

/**
 * 
 * @param {Command} command 
 */
Command.start = command => {
	console.log("start", Command.str(command));
	switch (command.verb) {
	case "+":
	case "set":
		command.before = command.subject[command.object];
		break;
	case "attack":
		if (!command.value) command.value = command.subject.selectedAction;
		if (!command.object) {
			const tid = command.subject.selectedTargetId;
			let target = fight.team.find(p => p.id === tid);
			command.object = target;
		}
		if ( ! command.carrier) {
			command.carrier = new Sprite({label:command.value});
			command.carrier.name = command.value;
		}
		break;
	}
	if (command.label) {
		command.oldLabel = command.subject.label; // for reset after
		command.subject.label = command.label;
	}
}; // ./start

/**
 * 
 * @param {Command} command 
 */
Command.finish = command => {
	console.log("finishing...", Command.str(command));
	if (command.subject) {
		command.subject.label = command.oldLabel;
	}
	switch (command.verb) {
	case "+":
		// avoid floating point issues from update
		command.subject[command.object] = command.before + command.value;
		break;
	case "set":
		command.subject[command.object] = command.value;
		break;
	case "attack":
		if ( ! command.damage) command.damage = 10;
		let affinities = command.affinities || command.subject.affinities;
		// weak / strong?
		let label = command.damage;
		let damage = command.damage;
		// robot hit a player?
		if (command.object.affinity && affinities) {
			let reaction = affinities[command.object.affinity];
			if (reaction === 'strong') {
				damage *= 2;
				label = 'weak'; // the label is on the target, so opposite to the attacker's reaction
			} else if (reaction === 'weak') {
				damage *= 0.5;
				label = 'strong';
			}
		} else if (command.object.affinities && command.affinity) {
			// player hit a robot?
			let reaction = command.object.affinities[command.affinity];
			label = reaction;
			if (reaction === 'strong') {
				damage *= 0.25;
			} else if (reaction === 'weak') {
				damage *= 2;
			}
		}
		const c = new Command(command.object, "+", "health", -damage).setDuration(1000);
		c.label = label;
		cmd(c);
		// check for death & victory / defeat after the health hit has taken effect
		cmd(new Command(fight, "check-state").setDuration(0));
		doNextTurn();
		break;
	case "guard":
		doNextTurn();
		break;
	case "check-state":
		Fight.sprites(fight).forEach(sp => {
			if (sp.health > 0) return;
			cmd(new Command(sp, "die"));
		});
		let alive = fight.enemies.filter(s => s.health > 0);
		if ( ! alive.length) {
			cmd(new Command(fight, "win"));
		}
		break;
	case "win":
		alert("Victory!");
		break;
	case "die":
		if ( ! fight.dead) fight.dead=[];
		fight.dead.push(command.subject);
		fight.enemies = fight.enemies.filter(s => s !== command.subject);
		fight.team = fight.team.filter(s => s !== command.subject);
		break;
	}
	console.log("...finished", Command.str(command));
}; // ./finish

/**
 * 
 * @param {Command} command 
 */
Command.updateCommand = (command, dmsecs) => {
	const dfraction = dmsecs / command.duration;
	switch (command.verb) {
	case "+":
		command.subject[command.object] = command.before + command.value * dfraction;
		break;
	case "attack":
		if (command.carrier) {
			let { x: x1, y: y1 } = command.subject;
			let { x: x2, y: y2 } = command.object;
			let x = x2 * dfraction + x1 * (1 - dfraction);
			let y = y2 * dfraction + y1 * (1 - dfraction);
			command.carrier.x = x;
			command.carrier.y = y;
		}
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


const doAction = ({ action, active, target }) => {
	action = action.toLowerCase();
	let attackCommand = new Command(active, "attack", target, action);
	attackCommand.damage = 10;
	attackCommand.affinities = active.affinities;
	attackCommand.affinity = active.affinity;
	switch (action) {
	case "guard":
		attackCommand = new Command(active, "guard");
		break;
	case "honey badger":
		attackCommand.carrier = SpriteLib.badger();
		attackCommand.damage = 50;
		break;
	case "bunny":
		attackCommand.carrier = SpriteLib.bunny();
		break;
	case "fish":
		attackCommand.carrier = SpriteLib.fish();
		break;
	case "goose":
		attackCommand.carrier = SpriteLib.goose();
		break;
	case "chicken":
		attackCommand.carrier = SpriteLib.chicken();
		break;
	}
	cmd(attackCommand);
};


const doNextTurn = () => {
	let spriteIds = [...fight.team, ...fight.enemies].map(s => s.id);
	let i = spriteIds.indexOf(fight.turn);
	i = (i + 1) % spriteIds.length;
	let nextId = spriteIds[i];
	cmd(new Command(fight, "set", "turn", nextId, { duration: 100 }));

	// hack random attack
	let activeEnemy = fight.enemies.find(s => s.id === nextId);
	if (activeEnemy) {
		cmd(new Command(activeEnemy, "pick", "selectedTargetId", fight.team.map(p => p.id)));
		cmd(new Command(activeEnemy, "pick", "selectedAction", activeEnemy.spells));
		cmd(new Command(activeEnemy, "attack"));
	}
};

const Peep = ({ sprite, selected }) => {
	if (sprite.src && sprite.src.includes(".svg")) {
		return (<div onClick={e => setFocus(sprite)} className={space('peep', selected && "selected")}
			style={{ position: 'absolute', width: '200px', top: sprite.y, left: sprite.x }}
		>
			{selected ? <b>{sprite.name}</b> : sprite.name}
			<DrawReact src={sprite.src} />
			{sprite.label? <h4>{sprite.label}</h4> : null}
			Health: {Math.round(sprite.health)}
			{sprite.health <= 0 ? <div style={{ position: 'absolute', bottom: 0 }}><DrawReact src={'/img/src/fire.svg'} /></div> : null}
		</div>);
	}
	return sprite.name;
};

const setFocus = sprite => DataStore.setValue(['focus', 'Sprite'], sprite.id);

const Enemy = ({ sprite }) => <Peep sprite={sprite} />;

const KAffinity = new Enum("mammal bird reptile fish bug plant");
const EMOJI = {
	mammal: "🐾",
	bird: "🦆",
	reptile: "🦎",
	fish: "🐟",
	bug: "🐜",
	plant: "🌿"
};

const makeFight = () => {
	// let game = Game.get(); game is tied to pixi which we aren't using
	let fight = new Fight();
	fight.team = [
		new Sprite({ name: "Alice", src: "/img/src/alice.svg", spells: ['Honey Badger', 'Bunny', 'Wolf'], health: 100, x: 20, y: 50, affinity: 'mammal' }),
		new Sprite({ name: "Bob", src: "/img/src/bob.svg", spells: ['Fish', "Chicken", "Goose"], health: 100, x: 30, y: 300, affinity: 'bird' })
	];
	fight.enemies = [
		new Monster({
			name: "Angry Robot", src: "/img/src/angry-robot.svg", spells: ['Laser Glare', 'Sonic Punch'], health: 70, x: 500, y: 100,
			affinities: { mammal: 'weak', bird: 'strong' }
		}),
		// new Monster({name:"Nasty Robot"})
	];
	fight.turn = fight.team[0].id;
	DataStore.setValue(["misc", "game", "fight"], fight, false);

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
