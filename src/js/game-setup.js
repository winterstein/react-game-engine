
import DataStore from './base/plumbing/DataStore';
import {getClass, nonce} from './base/data/DataClass';
import {isMobile} from './base/utils/miscutils';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import Tile from './data/Tile';
import SpriteLib from './data/SpriteLib';
import Game from './Game';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from './Key';
import { assMatch, assert } from 'sjtest';

// import { addScript } from './base/utils/miscutils';
import pJoyRing from './components/pJoyRing';
import {containerFor, setPApp, setPSpriteFor, getPSpriteFor, getPApp} from './components/Pixies';

const DEBUG_FOCUS = false;

/**
 * @param {!Game} game
 */
Game.basicPixiSetup = game => {
	const grid = Game.grid(game);
	let papp = getPApp();
	if ( ! papp) {		
		let screenWidth = window.innerWidth;
		let screenHeight = window.innerHeight;
		// scale?
		if (screenWidth < 1000) {
			grid.screenScale = 0.75;
		}
		grid.screenWidth = screenWidth / grid.screenScale; 
		grid.screenHeight = screenHeight / grid.screenScale;
		// ??how to manage the browser address bar and UI blocking part of the screen??
		grid.vw = grid.screenWidth/100;
		grid.vh = grid.screenHeight/100;
		console.log("app size "+window.innerWidth+" x "+window.innerHeight);
		papp = new PIXI.Application({width: screenWidth, height:screenHeight});
		setPApp(papp);
		window.app = papp;
	}
	
	if (true) { 
		// Is repeating this a memory leak?? If so, how should we dispose of old worlds??
		// Standard containers
		// a handy container for the game world, to separate it from UI
		const world = new PIXI.Container();
		world.setTransform(0,0,grid.screenScale,grid.screenScale);
		papp.stage.addChild(world);
		containerFor.world = world;
		// Tiles for the background
		// NB: ParticleContainer only works with a single source image!
		containerFor.ground = new PIXI.Container();
		world.addChild(containerFor.ground);
		// Animals
		containerFor.characters = new PIXI.Container();
		world.addChild(containerFor.characters);	
		// UI container
		containerFor.ui = new PIXI.Container();
		papp.stage.addChild(containerFor.ui);
		containerFor.ui.setTransform(0,0,grid.screenScale,grid.screenScale);
	}

	if (papp.loadFlag) {
		// e.g. reset world
		setupAfterLoad(game);
		return;
	}

	let srcs = new Set();
	// // creatures
	// let creatures = KindOfCreature.kinds;
	// Object.values(creatures).forEach(c => {
	// 	if (c.sprites) {
	// 		c.sprites.forEach(s => srcs.add(s.src));
	// 	}
	// });
	// // Tiles
	// srcs.add(SpriteLib.alligator().src);	
	// srcs.add(SpriteLib.shark().src);
	// // srcs.add(SpriteLib.goose().src);

	// srcs.add(SpriteLib.icon('Grab').src);
	// srcs.add(SpriteLib.icon('PickAxe').src);
	// srcs.add(SpriteLib.icon('Switch').src);
	// srcs.add(SpriteLib.icon('Meat').src);
	// srcs.add(SpriteLib.icon('Wood').src);
	// srcs.add(SpriteLib.icon('Egg').src);

	// srcs.add(SpriteLib.tile("Earth").src);
	// srcs.add(SpriteLib.tile("Grass").src);
	srcs.add(SpriteLib.tile("Water").src);
	// srcs.add(SpriteLib.tile("Tree").src);

	let loader = papp.loader;
	srcs.forEach(src => loader.add(src));

	loader.load(() => setupAfterLoad(game));
};

/**
 * 
 * @param {!Game} game 
 */
const setupAfterLoad = game => {	
	// mark as loaded
	const papp = getPApp();
	papp.loadFlag = true;
};
Game.setup = game => {
	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 10; grid.height = 10;
	grid.display = '2d';

	// Kinds (needed here for resets)
	Game.addKind(game, Water);
	
	Game.basicPixiSetup(game);
};

export default {}; // dummy export to keep imports happy
