
import DataStore from './base/plumbing/DataStore';
import {getClass, nonce} from './base/data/DataClass';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import SpriteLib from './data/SpriteLib';
import Game from './Game';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from './Key';
import { assMatch } from 'sjtest';

/**
 * @param {!Game} game
 * @param {!Sprite} sprite An instance of a sprite
 * @returns {Sprite} sprite, having set sprite.pixi
 */
const makePixiSprite = (game, sprite, name, container) => {
	Game.assIsa(game);
	Sprite.assIsa(sprite);
	assMatch(name, String);
	assert( ! game.sprites[name], "Duplicate sprite for "+name);
	// let pres = app.loader.resources[sprite.src];
	// // console.log(name, pres.texture);
	// assert(pres, "Not loaded Pixi resource "+sprite.src);
	// const w = sprite.width || 48;
	// const h = sprite.height || 48;
	// set texture - NB: copy otherwise sprites share data and conflict if frame is modified
	// let frame = sprite.frames && sprite.frames[sprite.frameIndex];
	// let tframe = frame? new PIXI.Rectangle(frame[0],frame[1],w,h) : new PIXI.Rectangle(0,0,w,h);
	// let texture = new PIXI.Texture(pres.texture, tframe);
	// let psprite = new PIXI.Sprite(texture);
	let psprite = new PIXI.Sprite();	
	sprite.pixi = psprite;

	Sprite.setPixiProps(sprite);
	
	if ( ! container) container = game.containerFor.world;
	container.addChild(psprite);
	game.sprites[name] = sprite;
	// let res = texture.res
	// console.log("Made "+name+" from",sprite,"texture",psprite.texture);
	return sprite;
};

/**
 * @param {!Sprite} sprite
 */
Sprite.setPixiProps = sprite => {
	const psprite = sprite.pixi;
	psprite.x = sprite.x;
	psprite.y = sprite.y;
	// set texture - NB: copy otherwise sprites share data and conflict if frame is modified
	const w = sprite.width || 48;
	const h = sprite.height || 48;
	let frame = sprite.frames && sprite.frames[sprite.frameIndex];
	let tframe = frame? new PIXI.Rectangle(frame[0],frame[1],w,h) : new PIXI.Rectangle(0,0,w,h);
	let pres = app.loader.resources[sprite.src];
	assert(pres, "Not loaded Pixi resource "+sprite.src);
	let texture = new PIXI.Texture(pres.texture, tframe);
	psprite.texture = texture; //let psprite = new PIXI.Sprite(texture);	
};

/**
 * @param {!Game} game
 */
Game.basicPixiSetup = game => {
	if ( ! game.app) {
		game.width = window.innerWidth;
		game.height = window.innerHeight;
		console.log("app size "+window.innerWidth+" x "+window.innerHeight);
		game.app = new PIXI.Application(game.width, game.height);
		window.app = game.app;
	}
	
	const app = game.app;
	// a handy container for the game world, to separate it from UI
	const world = new PIXI.Container();
	app.stage.addChild(world);
	game.containerFor.world = world;

	// Tiles for the background
	// NB: ParticleContainer only works with a single source image!
	game.containerFor.ground = new PIXI.Container();
	world.addChild(game.containerFor.ground);
	game.containerFor.characters = new PIXI.Container();
	world.addChild(game.containerFor.characters);
	game.containerFor.ui = new PIXI.Container();
	app.stage.addChild(game.containerFor.ui);

	app.loader
	.add("/img/animals.TP.json")
	.add(SpriteLib.alligator().src)
	.add(SpriteLib.goat().src)
	.add(SpriteLib.frog().src)
	.add(SpriteLib.chicken().src)
	.add(SpriteLib.goose().src)
	.add(SpriteLib.grab().src)
	.add(SpriteLib.pickAxe().src)
	.add(SpriteLib.tile("grass").src)
	.add(SpriteLib.tile("water").src)
	  .load(() => setupAfterLoad(game));
}

const setupAfterLoad = game => {

	if (true) {
		setupAfterLoad2_Player(game);
	}

	// UI
	if (true) {

		// Create the inventory bar
		let width = 6*50+20;
		const stage = game.app.stage;
		const inventoryBar = new PIXI.Container();
		inventoryBar.name = "inventoryBar";
		inventoryBar.position.set((game.width - width) / 2, 500);
		console.log("inventoryBar",inventoryBar);
		game.containerFor.ui.addChild(inventoryBar);		

		//Create the black background rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.lineStyle(4, 0xFF3300, 1);
		innerBar.beginFill(0xCCFFFF);
		innerBar.drawRoundedRect(0, 0, 6*50, 50, 10);
		innerBar.endFill();
		inventoryBar.addChild(innerBar);

		// default inventory
		{	// grab
			let grabSprite = makePixiSprite(game, SpriteLib.grab(), "grab", inventoryBar);
			let psprite = grabSprite.pixi;
			psprite.interactive = true;
			const onDown = e => {
				console.log("onDown",e, ""+e.target);
				let player = game.sprites.player0;
				console.log("TODO what can we grab");
			};
			psprite.on('mousedown', onDown);
			psprite.on('touchstart', onDown);
		}
		if (false) {	// weapon - pickaxe
			let grabSprite = makePixiSprite(game, SpriteLib.pickAxe(), "pickAxe", inventoryBar);
			grabSprite.x = 50;
			let psprite = grabSprite.pixi;
			psprite.interactive = true;
			const onDown = e => {
				console.log("onDown",e, ""+e.target);
				let player = game.sprites.player0;
				console.log("TODO what can we hit");
			};
			psprite.on('mousedown', onDown);
			psprite.on('touchstart', onDown);
		}

		{
			let isprite = makePixiSprite(game, SpriteLib.frog(), "inventory1", inventoryBar);
			isprite.x = 100;
			let psprite = isprite.pixi;
			psprite.interactive = true;
			const onDown = e => {
				console.log("onDown",e, ""+e.target);
				let player = game.sprites.player0;
				let spawn = makePixiSprite(game, isprite, isprite.name+nonce(), game.containerFor.characters);
				spawn.x = player.x;
				spawn.y = player.y;
			};
			psprite.on('mousedown', onDown);
			psprite.on('touchstart', onDown);
		}

	}

	// land
	if (true) {
		let landPlan = makeLandPlan(game);
		// // sprites
		// const w = SpriteLib.tile("water");
		// w.x = 48; w.y=48;
		// makePixiSprite(game, w, "water00", game.containerFor.characters);
		// makePixiSprite(game, SpriteLib.tile("grass"), "grass11", game.containerFor.ground);
		for(let rowi = 0; rowi<landPlan.length; rowi++) {
			for(let coli = 0; coli<landPlan[0].length; coli++) {
				let cell = landPlan[rowi][coli];
				let tileSprite = SpriteLib.tile(cell);
				tileSprite.x = coli * tileSprite.width;
				tileSprite.y = rowi * tileSprite.height;
				makePixiSprite(game, tileSprite, "row"+rowi+"_col"+coli, game.containerFor.ground);
			}
		}
	}
};

const setupAfterLoad2_Player = game => {
	let sprite = makePixiSprite(game, SpriteLib.goose(6), "player0", game.characters);

	let right = new Key(KEYS.ArrowRight);
	let left = new Key(KEYS.ArrowLeft);
	let up = new Key(KEYS.ArrowUp);
	let down = new Key(KEYS.ArrowDown);

	right.press = () => Game.handleInput({input:'right', on:true});
	right.release = () => Game.handleInput({input:'right', on:false});
	left.press = () => Game.handleInput({input:'left', on:true});
	left.release = () => Game.handleInput({input:'left', on:false})
	up.press = () => Game.handleInput({input:'up', on:true});
	up.release = () => Game.handleInput({input:'up', on:false})
	down.press = () => Game.handleInput({input:'down', on:true});
	down.release = () => Game.handleInput({input:'down', on:false})

	/**
	 * @param {!String} input e.g. "up"
	 */
	Game.handleInput = ({input, on}) => {
		const v = 100; // pixles per second
		switch(input) {
			case 'up':
				if (on) sprite.dy = -v;
				if ( ! on && sprite.dy < 0) sprite.dy = 0;
				break;
			case 'down':
				if (on) sprite.dy = v;
				if ( ! on && sprite.dy > 0) sprite.dy = 0;
				break;
			case 'left':
				if (on) {
					sprite.dx = -v;
					Sprite.animate(sprite, 'left');
				}
				if ( ! on && sprite.dx < 0) sprite.dx = 0;
				break;
			case 'right':
				if (on) {
					sprite.dx = v;
					Sprite.animate(sprite, 'right');
				}
				if ( ! on && sprite.dx > 0) sprite.dx = 0;
				Sprite. sprite
				break;
		}
		console.log(input, on, sprite.dx + " dy: "+sprite.dy, sprite);
	};
};


Game.setup = game => {
	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';
	Game.grid = grid;

	Game.basicPixiSetup(game);
};

const makeLandPlan = game => {
	return [['water','grass'],['grass','earth','water'],['grass','earth','water'],
	['grass','earth','water','water','water','grass'],
	['grass','earth','water','water','water','grass']];
};


export default {}; // dummy export to keep imports happy
