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
// import * as PIXISound from 'pixi-sound';
import Key, { KEYS } from '../Key';
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col, Card, CardTitle } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import GameAdmin, { doNewWorld } from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Fight from '../data/Fight';
import Spell from '../data/Spell';
import Monster from '../data/Monster';

import ReactVivus from 'react-vivus';
import { space, randomPick, modifyHash } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import { CHARACTERS } from '../Character';
import MONSTERS from '../MONSTERS';
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
	let lhs = DataStore.getUrlValue("lhs");
	let rhs = DataStore.getUrlValue("rhs");
	fight = Game.get().fight;
	if ( ! fight) {
		fight = makeFight({world,lhs,rhs});
		Game.get().fight = fight;
	}
	let sprites = Fight.sprites(fight);
	let activeSprite = sprites.find(s => s.id === fight.turn);
	let focalSprite = sprites.find(s => s.id === DataStore.getValue('focus', 'Sprite'));

	let target;
	if (Monster.isa(activeSprite)) {
		target = fight.team[0]; //selected??
		if (target) focalSprite = target;
	} else {
		if (Sprite.isa(focalSprite)) {
			target = focalSprite;
		} else {
			target = fight.enemies[0];
		}
	}
	let c0 = Command.peek();
	let badger = SpriteLib.badger();
	badger.x = 200; badger.y = 200;

	return (<div style={{ position: 'relative', userSelect: "none", overflow: "hidden" }}>
		<div className='flex-row'>
			<div className="position-relative" style={{ width: '700px', height: '90vh' }}>
				{fight.team.map((peep,i) => <Peep i={i} key={peep.id} sprite={peep} selected={peep === activeSprite} focus={peep===focalSprite} />)}

				{fight.enemies.map((peep,i) => <Peep i={i} key={peep.id} sprite={peep} selected={peep === activeSprite} focus={peep===focalSprite} />)}

				{c0 && c0.carrier ? <ImgSprite sprite={c0.carrier} /> : null}
			</div>
			<div>
				{focalSprite ? (<Card body className='game-card'><CardTitle><h3>{focalSprite.name}</h3></CardTitle>
					{focalSprite.affinity ? <h3>{EMOJI[focalSprite.affinity]}</h3> : null}
					<div>
						Health: {Math.round(focalSprite.health)} {focalSprite.maxHealth? "("+Math.round(100*focalSprite.health / focalSprite.maxHealth)+"%)" : null}
					</div>
					{focalSprite.affinities ? <table><tbody>
						<tr>{KAffinity.values.map(a => <td key={a}>{EMOJI[a]}</td>)}</tr>
						<tr>{KAffinity.values.map(a => <td key={a}>{focalSprite.knowAffinity && focalSprite.knowAffinity[a]? (focalSprite.affinities[a] || '-') : '?'}</td>)}</tr>
					</tbody></table>
						: null}
				</Card>) : null}
			</div>
		</div>{/* ./flex-row */}
		<pre>
			Active: {activeSprite && activeSprite.name}
		</pre>				

		Options:
		{activeSprite && activeSprite.spells && activeSprite.spells.map(spell => <ActionButton active={activeSprite} target={target} key={spell} action={spell} />)}
		<ActionButton action={'Guard'} active={activeSprite} />
	</div>);
};

const ImgSprite = ({ sprite, width, height, style}) => {
	if ( ! width && sprite.src) width=48;
	if ( ! height && sprite.src) height=48;
	if (width) width = width+"px";
	if (height) height = height+"px";
	return (<div className='peep' style={{ position: "absolute", top: sprite.y, left: sprite.x, width, height, overflow: "hidden" }}>
		{sprite.src? <img src={sprite.src} style={style} /> : (sprite.label || sprite.name || getType(sprite) || sprite.id)}</div>);
};

const ActionButton = ({ action, active, target }) => {
	let label = action;
	if (Spell.isa(action)) {
		label = action.name;
	}
	return (<Button
		color={Monster.isa(active) ? (active.selectedAction === action ? 'warning' : 'danger') : 'primary'}
		disabled={Monster.isa(active)}
		className='mr-2'
		onClick={e => doAction({ action, active, target })}>{action.affinity?EMOJI[action.affinity]:null}{label}</Button>);
};




/************************************************************************************* */
/***********************************************************************************/

/**
 * 
 * @param {Command} command 
 */
Command.start = command => {
	// undo guard, if they were
	if (command.subject.stance === 'guard' && command.verb !== 'guard') {
		command.subject.defence -= 1;
	}		

	console.log("start", Command.str(command));
	switch (command.verb) {
	case "+":
	case "set":
		command.before = command.subject[command.object];
		break;
	case "attack":		
		if ( ! command.value) {
			let spell = command.subject.selectedAction;
			command.value = spell;
			command.damage = spell.damage || 10;
			command.affinity = spell.affinity;
		}
		if ( ! command.object) {
			const tid = command.subject.selectedTargetId;
			let target = fight.team.find(p => p.id === tid);
			command.object = target;
		}
		if ( ! command.carrier) {
			let label = command.value;
			if (Spell.isa(label)) label = label.name;
			command.carrier = new Sprite({label});
			command.carrier.name = label;
		}
		// a sound
		// PIXI.sound.play(command.affinity==='bird'?"bird":'sword');
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
	case "pick":
		command.subject[command.object] = randomPick(command.value);
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
		if ( ! command.object.knowAffinity) command.object.knowAffinity = {};
		if (command.affinity) command.object.knowAffinity[command.affinity] = true;
		// guard?
		if (command.object.stance === "guard") {
			damage *= 0.75; // reduce damage by 25%
		}
		const c = new Command(command.object, "+", "health", -damage).setDuration(1000);
		c.label = label;
		cmd(c);
		// check for death & victory / defeat after the health hit has taken effect
		cmd(new Command(fight, "check-state").setDuration(0));
		doNextTurn();
		break;
	case "guard":
		command.subject.defence = (command.subject.defence || 0) + 1;
		command.subject.stance = 'guard';
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
		alive = fight.team.filter(s => s.health > 0);
		if ( ! alive.length) {
			cmd(new Command(fight, "lose"));
		}
		break;
	case "lose":
		alert("Defeat!");
		break;
	case "win":
		alert("Victory!");
		let monster = DataStore.getValue(['misc','monster']) || DataStore.setValue(['misc','monster'], new Sprite({name:"Yargl the Terrible"}));
		monster.dead = true;
		modifyHash(['explore']);
		break;
	case "die":
		if ( ! fight.dead) fight.dead=[];
		fight.dead.push(command.subject);
		fight.enemies = fight.enemies.filter(s => s !== command.subject);
		fight.team = fight.team.filter(s => s !== command.subject);
		adjustHeight(fight.enemies);
		break;
	}
	console.log("...finished", Command.str(command));
}; // ./finish

const adjustHeight = sprites => sprites.forEach((e,i) => e.y = 250*i);

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
	const actionName = Spell.isa(action)? action.name.toLowerCase() : action.toLowerCase();
	let attackCommand = new Command(active, "attack", target, action);
	attackCommand.damage = action.damage || 10;
	attackCommand.affinities = active.affinities;
	attackCommand.affinity = action.affinity || active.affinity;
	switch (actionName) {
	case "guard":
		attackCommand = new Command(active, "guard");
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

const Peep = ({i, sprite, selected, focus }) => {
	if (sprite.src) {
		return (<div onClick={e => setFocus(sprite)} className={space('peep', selected && "selected", focus && "focus")}
			style={{ position: 'absolute', width: '200px', top: sprite.y, left: sprite.x }}
		>
			{selected ? <b>{sprite.name}</b> : null}
			{sprite.src.includes(".svg")? <DrawReact src={sprite.src} /> : <img src={sprite.src} style={{maxWidth:'200px',maxHeight:'200px',transform:"scaleX(-1)"}} />}
			{sprite.label? <h4>{sprite.label}</h4> : null}
			{selected || focus? <div>Health: {Math.round(sprite.health)}</div> : null}
			{sprite.health <= 0 ? <div style={{ position: 'absolute', bottom: 0 }}><DrawReact src={'/img/src/fire.svg'} /></div> : null}
		</div>);
	}
	console.warn("No src for sprite", sprite);	
	return sprite.name;
};

const setFocus = sprite => DataStore.setValue(['focus', 'Sprite'], sprite.id);

const KAffinity = new Enum("mammal bird reptile fish bug plant");
const EMOJI = {
	mammal: "🐾",
	bird: "🦆",
	reptile: "🦎",
	fish: "🐟",
	bug: "🐜",
	plant: "🌿"
};

const makeFight = ({world,rhs,lhs}) => {
	// let game = Game.get(); game is tied to pixi which we aren't using
	let fight = new Fight();	

	// Your side!
	if ( ! lhs ) lhs ="team";
	if (lhs === "team") {
		console.warn("TODO who are team?");
		lhs ="james+katie+honeybadger";
	}	
	let teamNames = lhs.split("+");
	fight.team = teamNames.map(n => CHARACTERS[n]).filter(x => !!x);

	// The enemy!
	fight.enemies = []; // end enemies
	if ( ! rhs ) rhs = "monster+monster+monster";
	let enemyNames = rhs.split("+");
	enemyNames.forEach(en => {
		if (en==="monster") {
			// random!
			en = randomPick(Object.keys(MONSTERS));
		}
		let monster = MONSTERS[en];
		if (monster) {
			monster = new Monster(monster); // copy
			monster.id = "M"+nonce(6); // a new id please
			monster.x = 500;
			fight.enemies.push(monster); 
			return;
		}
		// or?		
		// x
		let m = en.match(/x(\d)$/);
	});	

	// layout
	adjustHeight(fight.team);
	adjustHeight(fight.enemies);
	// random strong/weak
	fight.enemies.forEach(enemy => {
		enemy.affinities = {};
		enemy.affinities[randomPick(KAffinity.values)] = 'weak';
		enemy.affinities[randomPick(KAffinity.values)] = 'strong';
	});
	// setup maxHealth
	Fight.sprites(fight).forEach(sp => sp.maxHealth = sp.maxHealth || sp.health);

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

// Sounds
// console.log("PIXI",PIXI);
// console.log("PIXISound",PIXISound);
// PIXISound.sound.add('sword', 'http://pixijs.io/pixi-sound/examples/resources/sword.mp3');
// PIXISound.sound.add('bird', 'http://pixijs.io/pixi-sound/examples/resources/bird.mp3');

export default FightPage;
