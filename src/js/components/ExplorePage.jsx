/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState, useEffect } from 'react';
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
import { space, randomPick, modifyHash } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import ServerIO from '../base/plumbing/ServerIOBase';

import Dungeon from 'dungeon-generator';
import { assMatch } from '../base/utils/assert';
import {collision} from './Collision';

let dungeon = new Dungeon({
    size: [100, 100], 
    seed: nonce(),
    rooms: {
        initial: {
            min_size: [3, 3],
            max_size: [3, 3],
            max_exits: 1,
            position: [0, 0] //OPTIONAL pos of initial room 
        },
        any: {
            min_size: [2, 2],
            max_size: [5, 5],
            max_exits: 4
        }
    },
    max_corridor_length: 6,
    min_corridor_length: 2,
    corridor_density: 0.5, //corridors per room
    symmetric_rooms: false, // exits must be in the center of a wall if true
    interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
    max_interconnect_length: 10,
    room_count: 12
});
 
dungeon.generate();
dungeon.print(); //outputs wall map to console.log
console.log("dungeon", dungeon);

let player;

const keyLeft = new Key(KEYS.ArrowLeft);
const keyRight = new Key(KEYS.ArrowRight);
const keyUp = new Key(KEYS.ArrowUp);
const keyDown = new Key(KEYS.ArrowDown);

const getWall = (x,y) => {
	if (x<0 || y<0) return true; 
	let row = dungeon.walls.rows[y];
	if ( ! row) return true; 
	return row[x];
};
const getRoom = (x,y) => {
	let s = {x:x-0.2,y:y-0.2,width:0.1,height:0.1};
	let room = dungeon.children.find(c => {
		// console.log(c);
		let cs = {x:c.position[0], y:c.position[1], width:c.room_size[0], height:c.room_size[1]};
		const hit = collision(s, cs);
		if (hit) {
			return true;
		}
		return false;
	});
	if ( ! room) return null;
	if ( ! room.length) { // only corridors have length } && Math.min(...room.room_size) > 1) {
		return room;
	}
	return null;
};
window.getRoom = getRoom;

const setupMonster = () => {
	let monster = DataStore.getValue(['misc','monster']) || DataStore.setValue(['misc','monster'], new Sprite({name:"Yargl the Terrible"}), false);
	if ( ! monster.x || monster.dead) {
		let mx,my;
		for(let i=0; i<1000; i++) {
			mx = 5+Math.floor(20*Math.random());
			my = 5+Math.floor(20*Math.random());
			if (getRoom(mx,my)) {
				break;
			}
		}
		monster.x = mx;
		monster.y = my;
		monster.dead = false;
	}
	return monster;
};

const ExplorePage = () => {
	// dungeon.size; // [width, heihgt]
	// dungeon.walls.get([x, y]); //return true if position is wall, false if empty
	// console.log("dungeon", dungeon);
	// for(let piece of dungeon.children) {
	// 	piece.position; //[x, y] position of top left corner of the piece within dungeon
	// 	piece.tag; // 'any', 'initial' or any other key of 'rooms' options property
	// 	piece.size; //[width, height]
	// 	piece.walls.get([x, y]); //x, y- local position of piece, returns true if wall, false if empty
	// 	for (let exit of piece.exits) {
	// 		let {x, y, dest_piece} = exit; // local position of exit and piece it exits to
	// 		piece.global_pos([x, y]); // [x, y] global pos of the exit
	// 	}
	 
	// 	piece.local_pos(dungeon.start_pos); //get local position within the piece of dungeon's global position
	// }	 
	let iRoom = dungeon.initial_room; //piece tagged as 'initial'
	let sx_sy = dungeon.start_pos; //[x, y] center of 'initial' piece 
	if ( ! player) {
		player = new Sprite({name:"Alice",x:sx_sy[0], y:sx_sy[1]});		
	}	
	let monster = setupMonster();

	const onTick = ticker => {
		// console.log("onTick", this, ticker);
		let nx = player.x; 
		let ny = player.y;
		if (keyLeft.isDown) nx--;
		if (keyRight.isDown) nx++;
		if (keyUp.isDown) ny--;
		if (keyDown.isDown) ny++;
		if (getWall(nx,ny)) {
			// collision
			console.log("bump");
		} else {
			player.x = nx;
			player.y = ny;
			if (player.x===monster.x && player.y===monster.y) {
				modifyHash(['fight']);
			}
			DataStore.update();
		}
	};

	return (<div>
		<GameLoop onTick={onTick}>
			DUNGEON
			<MiniMap player={player} />
		</GameLoop>
	</div>);
};

const GameLoop = ({onTick, onClose, children}) => {
	assMatch(onTick, Function);
	// tick
	let [gl] = useState({});
	
	const gameLoop = () => {
		if (gl.stop) {
			console.log("STOPPED");
			return;
		}
		//Call this `gameLoop` function on the next screen refresh
		//(which happens 60 times per second)		
		requestAnimationFrame(gameLoop);
		// tick
		let tick = StopWatch.update(gl.ticker);
		if (tick) {
			onTick(gl.ticker);
		}
	};

	useEffect(() => {
		// init
		gl.ticker = new StopWatch();	
		// update loop - use request ani frame
		gameLoop();
		// clean up
		return () => {
			gl.stop = true;
			// e.g. release keys
			if (onClose) onClose();
		};
	}, []);
			
	return children;
};

const MiniMap = ({}) => {
	let radius = 10; // diameter = 2radius + 1, cos odd is easier
	let rows = _.range(2*radius+1).map(i => player.y - radius + i);
	let cols = _.range(2*radius+1).map(i => player.x - radius + i);
	return (<table style={{lineHeight:1}}><tbody>
		{rows.map(y => <tr key={y}>{cols.map(x => 
			<td style={{width:"18px",height:"18px",overflow:"hidden",backgroundColor:bcol(x,y),fontSize:"16px"}} key={x+"_"+y} title={x+"_"+y}>
				{what(x,y)}
			</td>
		)}</tr>)}
	</tbody></table>);
};


const what = (x,y) => {
	if (x===player.x && y===player.y) return "🕵";
	if (x===setupMonster().x && y===setupMonster().y) return "🧞";
	return " ";
};

const bcol = (x,y) => {
	if (getWall(x,y)) {
		return getRoom(x,y)? "red" : "blue";
	}
	if (getRoom(x,y)) {
		return "green";
	}
	return "white";
};

export default ExplorePage;
