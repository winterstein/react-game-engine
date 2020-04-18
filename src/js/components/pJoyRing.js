
import Grid from '../data/Grid';
import Game from '../Game';
import * as PIXI from 'pixi.js';
import { assMatch, assert } from 'sjtest';
import {containerFor} from './Pixies';

/**
 * 
 * @returns {!PIXI.Container} joyRing, all wired up and added to UI
 */
const pJoyRing = ({game}) => {
	const joyRing = new PIXI.Container();
	joyRing.name = "joyRing";
	const grid = Game.grid(game);
	let h = grid.vh*15;
	const offset = 5*grid.vh;
	const top = grid.screenHeight - h - offset;
	joyRing.position.set(offset, top);
	containerFor.ui.addChild(joyRing);

	//Create the graphics
	let pg = new PIXI.Graphics();
	pg.name = 'joyRing > pg';
	pg.lineStyle(3, 0xFF3300, 1);
	pg.drawCircle(h/2, h/2, h/2 + 5);
	pg.drawCircle(h/2, h/2, h/4 - 5);
	
	let path = [0,h/2, h/4,5*h/8 , h/4,3*h/8];
	pg.drawPolygon(path);
	path = [h,h/2, 3*h/4,5*h/8 , 3*h/4,3*h/8];
	pg.drawPolygon(path);
	path = [h/2,0, 5*h/8,h/4, 3*h/8,h/4];
	pg.drawPolygon(path);
	path = [h/2,h, 5*h/8,3*h/4, 3*h/8,3*h/4];
	pg.drawPolygon(path);

	pg.calculateBounds();
	joyRing.addChild(pg);

	// controls
	pg.interactive = true;
	const lxy = ({x,y}) => [x/grid.screenScale - offset, y/grid.screenScale - top];
	const onStop = e => {
		Game.handleInput({input:'dxdy', on:false});
	};
	const margin=h*0.15;

	const onMove = e => {
		joyRing.lastInput = new Date().getTime();
		// e.stopPropagation(); TODO
		let [x,y] = lxy(e.data.global);
		if (x > h+margin || y > h+margin || x < -margin || y < -margin) {
			onStop(e);
			return;
		}
		let dx = x - h/2;
		let dy = y - h/2;
		Game.handleInput({input:'dxdy', dx, dy, on:true});
		// HACK fix not stopping reliably bug
		setTimeout(() => {
			let dt = new Date().getTime() - joyRing.lastInput;
			if (dt > 500) {
				onStop();
			}
		}, 500);
	};
	// pg.on('mousedown', e => console.log(e.type,pg,e));
	// pg.on('mousemove', onMove);
	// pg.on('touchstart', e => console.log(e.type, pg, e));
	pg.on('touchmove', onMove);		
	pg.on('touchend', onStop);
	pg.on('touchcancel', onStop);
	pg.on('touchendoutside', onStop);
	return joyRing;
};

export default pJoyRing;
