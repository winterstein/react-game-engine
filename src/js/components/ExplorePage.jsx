/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import Dungeon from 'dungeon-generator';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { assert } from 'sjtest';
import { nonce } from '../base/data/DataClass';
import Tree from '../base/data/Tree';
import DataStore from '../base/plumbing/DataStore';
import { assMatch } from '../base/utils/assert';
import { modifyHash, space } from '../base/utils/miscutils';
import { CHARACTERS } from '../Character';
import Sprite from '../data/Sprite';
import StoryTree from '../data/StoryTree';
import Game from '../Game';
import Key, { KEYS } from '../Key';
import StopWatch from '../StopWatch';
import ChatLine, { ChatControls, splitLine } from './ChatLine';
import { collision } from './Collision';



let dungeon = null;

const setupPlace = (place) => {
	if ( ! place) {
		dungeon = new Dungeon({
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
		let monster = setupMonster();
		console.log("dungeon", dungeon);		
		return dungeon;
	}

	if (place==='home') {
		dungeon = {
			name: 'home',
			start_pos:[4,13],
			children: [
				{
					name:'garden',
					position: [1, 1], 
					room_size: [9,3]
				},
				{
					name:'kitchen',
					position: [1, 5], 
					room_size: [4,2]
				},
				{
					name:'bedroom1',
					position: [6, 5], 
					room_size: [4,2]
				},
				{
					name:'toilet',
					position: [8, 8], 
					room_size: [2,1]
				},
				{
					name:'bedroom2',
					position: [6, 10], 
					room_size: [4,3]
				},
				{
					name:'livingroom',
					position: [1, 8], 
					room_size: [4,4]
				},
			],
			walls: {
				rows: [
					"xxxxxxxxxxx",
					"x.........x",
					"x.........x",
					"x.........x",
					"xx-xxxxxxxx",
					"x    x    x",
					"x    x    x",
					"x   xx-xxxx",
					"x      - tx",
					"x    x-xxxx",
					"x    x    x",
					"x    x    x",
					"xxxx-x    x",
					".....xxxxxx",
					"...........",
					"rrrrrrrrrrr",
				].map(r => r.split("").map(c => c===" "? false : c))				
			},
			spriteNameForx_y: {
				"9_5": "cassie",
				"7_11": "mom",
				"2_9": "dad"
			}
		};
		dungeon.maxy = dungeon.walls.rows.length - 1;
		dungeon.maxx = dungeon.walls.rows[0].length - 1;
		// nothing is seen yet
		dungeon.seen = dungeon.walls.rows.map(r => r.map(c => false));
		return dungeon;
	}
	throw new Error("TODO place "+place);
};

// /**
//  * Make the map bigger - 2x width and ehight
//  * @param {*} rows 
//  */
// let double = rows => {
// 	const rows2 = [];
// 	for (let i = 0; i < rows.length; i++) {
// 		const r = rows[i];
// 		const r2 = [];
// 		r.forEach(c => { r2.push(c); r2.push(c); });
// 		rows2.push(r2);
// 		rows2.push(r2);
// 	}
// 	return rows2;
// };

let player;

const keyLeft = new Key(KEYS.ArrowLeft);
const keyRight = new Key(KEYS.ArrowRight);
const keyUp = new Key(KEYS.ArrowUp);
const keyDown = new Key(KEYS.ArrowDown);

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {?Room} NB: Current usage is just boolean falsy
 */
const getRoom = (x,y) => {
	// let s = {x:x-0.2,y:y-0.2,width:0.1,height:0.1};
	let s = {x,y,width:0,height:0};
	let room = dungeon.children.find(c => {
		// console.log(c);
		let cs = {x:c.position[0]+0.1, y:c.position[1]+0.1, width:c.room_size[0]-0.2, height:c.room_size[1]-0.2};
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

const setSeen = (x,y) => {	
	if (true) return; // FIXME
	for(let r=y-3; r++; r<y+3) {
		let row = dungeon.seen[r];
		if ( ! row) continue;
		for(let c=x-3; c++; c<x+3) {
			if (c<0 || c>dungeon.maxx) continue;
			row[c] = true;
		}
	}
};
const isSeen = (x,y) => {
	return true;
	// let row = dungeon.seen[y];
	// if ( ! row) return null;
	// return row[x];
};

const ExplorePage = () => {
	let path = DataStore.getValue(['location','path']);
	let place = path && path[1];
	if ( ! dungeon) {
		setupPlace(place);
		window.storyTree.sceneSrcNode = StoryTree.currentSource(window.storyTree);
	}
	window.dungeon = dungeon;
	let sx_sy = dungeon.start_pos; //[x, y] center of 'initial' piece 
	if ( ! player) {
		player = Game.getPlayer(Game.get()) || CHARACTERS.james;
		player.x = sx_sy[0];
		player.y = sx_sy[1];
	}		
	const game = Game.get();
	let watchme = {"game.talking": game.talking};

	// get a text node
	let currentNode = StoryTree.current(window.storyTree);
	let currentText;
	if (game.talking) {
		currentNode = StoryTree.nextToText(window.storyTree, currentNode);
		currentText = StoryTree.text(currentNode);
		// NB talking = false is done in onTick
	}
	

	return (<Container>
		<GameLoop onTick={onTick}>
			DUNGEON
			<MiniMap player={player} />
			
			{game.talking && currentText && splitLine(currentText) && <ChatLine line={currentText} />}
			{game.talking && <ChatControls currentNode={currentNode} storyTree={window.storyTree} />}
		</GameLoop>
	</Container>);
};


const onTick = ticker => {
	// console.log("onTick", this, ticker);
	let nx = player.x; 
	let ny = player.y;
	// seen
	setSeen(nx,ny);
	const game = Game.get();
	if (game.talking) {
		let currentStoryNode = StoryTree.current(window.storyTree);
		if (currentStoryNode && StoryTree.isEnd(window.storyTree, currentStoryNode)) {
			game.talking = false;
			console.log("TALK DONE");
			StoryTree.setCurrentNode(window.storyTree, window.storyTree.sceneSrcNode);
		}	
		DataStore.update();	
		return; // in a talk
	}
	if (keyLeft.isDown) nx--;
	if (keyRight.isDown) nx++;
	if (keyUp.isDown) ny--;
	if (keyDown.isDown) ny++;
	if (nx !== player.x || ny !== player.y) {
		const w = what(nx,ny);
		if (nx<0 || ny<0 || nx>dungeon.maxx || ny>dungeon.maxy) {
			console.log("out");
			return;
		}
		if (w==='x' || w===true) {
			// collision
			console.log("bump");
			return;
		} 
		if (w===MONSTER) {
			modifyHash(['fight']);
		}
		if (CHARACTERS[w]) {
			maybeStartTalk(game, player, w);
			return; // no walking through people
		}
		player.x = nx;
		player.y = ny;
	}
	DataStore.update();	
};


const maybeStartTalk = (game, player, whoName) => {	
	// source story node?
	let storyNode = StoryTree.currentSource(window.storyTree);
	console.warn("maybeStartTalk", storyNode, player, whoName);
	if ( ! storyNode) {
		console.warn("no storynode");
		return;
	}
	// node for person?	
	let whoNodes = Tree.children(storyNode).filter(n => n.value && n.value.text==="{"+whoName+"}");
	if (whoNodes.length === 0) {
		whoNodes = Tree.children(storyNode).filter(n => n.value && n.value.text===whoName);
		if (whoNodes.length) console.warn("Handling bad script syntax: please use `{name}` for on-bump-into bits");
	}
	if (whoNodes.length !== 1) {
		console.warn("Could not cleanly find node for "+whoName, storyNode);
		return;
	}
	let whoNode = whoNodes[0];
	console.warn("YES StartTalk", whoName, whoNode);
	StoryTree.setCurrentNode(window.storyTree, whoNode);
	StoryTree.next(window.storyTree);
	game.talking = true;	
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

const SQSIZE="30px";

const MiniMap = ({}) => {
	let radius = 10; // diameter = 2radius + 1, cos odd is easier
	let rows = _.range(2*radius+1).map(i => player.y - radius + i);
	let cols = _.range(2*radius+1).map(i => player.x - radius + i);
	return (<table className='MiniMap' style={{lineHeight:1}}><tbody>
		{rows.map(y => <tr key={y}>{cols.map(x => 
			<td title={space(""+x, ""+y, getRoom(x,y) && getRoom(x,y).name)} 
				style={{width:SQSIZE,height:SQSIZE,overflow:"hidden",backgroundColor:bcol(x,y),fontSize:"24px"}}
				key={x+"_"+y}
			>
				{drawChar(what(x,y))}
			</td>
		)}</tr>)}
	</tbody></table>);
};

const drawChar = w => {
	if ( ! w) return null;
	switch(w) {
	case "cassie": return "👧";
	case MONSTER: return MONSTER;
	case "player": return "🚶";
	case "x": return null; // wall
	case "-": return "🚪";
	case ".": return null; // grass
	case "t": return "🚽";
	case "c": return "🍳";
	case "mom": return "👩";
	case "dad": return "👨";
	case "r": return "═";
	}
	return w.length > 1? w[0] : w; // unicode emojis
};

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @returns {!string} what/who's there: wall|door|floor|grass|null (out of map)
 */
const what = (x,y) => {
	// collision?
	if (x===player.x && y===player.y) {
		return "player";
	}
	if (x===setupMonster().x && y===setupMonster().y) return MONSTER;
	let sn = dungeon.spriteNameForx_y && dungeon.spriteNameForx_y[x+"_"+y];
	if (sn) return sn;
	return whatFloor(x,y);
};
const whatFloor = (x,y) => {
	// move
	if (x<0 || y<0) {
		return null; 
	}
	let row = dungeon.walls.rows[y];
	if ( ! row) return null; 
	const c = row[x];
	if ( ! c) return null;
	return c;
};
const MONSTER = "🧞";

const bcol = (x,y) => {
	const s = isSeen(x,y);
	if (s===false) return "#fcc";
	let w = whatFloor(x,y);	
	if ( ! w) return "rgba(0,0,0,0)";	
	switch(w) {
	case true: case "x": return "#666"; // wall
	case "-": return "#666";	// door
	case ".": return "#696";	// grass
	case "r": return "#666";	// road
	}
	// let r = getRoom(x,y);
	// if (r) return "#669";
	return "rgba(0,0,0,0)";
};

export default ExplorePage;
