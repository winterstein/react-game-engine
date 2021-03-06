
import DataStore from './base/plumbing/DataStore';
import {getClass, nonce} from './base/data/DataClass';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import SpriteLib from './data/SpriteLib';
import Game from './Game';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from './Key';

import Sheep from './creatures/Sheep';
import Fish from './creatures/Fish';
import Wolf from './creatures/Wolf';
import Chicken from './creatures/Chicken';
import Badger from './creatures/Badger';
import Goat from './creatures/Goat';
import Werewolf from './creatures/Werewolf';
import Frog from './creatures/Frog';
import { assert, assMatch } from './base/utils/assert';

const DEBUG_FOCUS = false;

/**
 * @param {!Game} game
 * @param {!Sprite} sprite An instance of a sprite
 * @param {!String} id Unique
 * @returns {Sprite} sprite, having set sprite.pixi
 */
const makePixiSprite = (game, sprite, id, container, graphics) => {
	Game.assIsa(game);
	Sprite.assIsa(sprite);
	assMatch(id, String);
		
	assert( ! game.sprites[id], "Duplicate sprite for "+id);
	game.sprites[id] = sprite;
	sprite.id = id;

	let psprite = graphics? new PIXI.Graphics() : new PIXI.Sprite();	
	sprite.pixi = psprite;

	Sprite.setPixiProps(sprite);
	
	if (graphics) {
		psprite.beginFill(0x66CCFF);
		psprite.drawCircle(10,10,20);			
		psprite.drawPolygon([new PIXI.Point(0,0), new PIXI.Point(10,10), new PIXI.Point(20,-20)]);
		psprite.endFill();
	}

	if ( ! container) container = game.containerFor.world;
	container.addChild(psprite);
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
	if ( ! sprite.src) return; // eg drawn Graphics

	// texture width & height
	// TODO detect no-op for speed??
	const w = (sprite.tileSize && sprite.tileSize[0]) || 48;
	const h = (sprite.tileSize && sprite.tileSize[1]) || 48;
	let frame = sprite.frames && sprite.frames[sprite.frameIndex];
	let tframe = frame? new PIXI.Rectangle(frame[0],frame[1],w,h) : new PIXI.Rectangle(0,0,w,h);
	let pres = app.loader.resources[sprite.src];
	assert(pres, "Not loaded Pixi resource "+sprite.src);
	let texture = new PIXI.Texture(pres.texture, tframe);
	psprite.texture = texture; //let psprite = new PIXI.Sprite(texture);
	// scale
	psprite.width = sprite.width;
	psprite.height = sprite.height;
};

/**
 * @param {!Game} game
 */
Game.basicPixiSetup = game => {
	if ( ! game.app) {
		let grid = Game.grid(game);
		grid.screenWidth = window.innerWidth; // ??how to manage the browser address bar and UI blocking part of the screen??
		grid.screenHeight = window.innerHeight;
		console.log("app size "+window.innerWidth+" x "+window.innerHeight);
		game.app = new PIXI.Application({width: grid.screenWidth, height:grid.screenHeight});
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

	let srcs = new Set();
	// creatures
	let creatures = Game.kinds(game);
	Object.values(creatures).forEach(c => {
		if (c.sprites) {
			c.sprites.forEach(s => srcs.add(s.src));
		}
	});
	// Tiles
	srcs.add(SpriteLib.alligator().src);
	srcs.add(SpriteLib.tile("Grass").src);
	srcs.add(SpriteLib.alligator().src);
	srcs.add(SpriteLib.goat().src);
	srcs.add(SpriteLib.frog().src);
	srcs.add(SpriteLib.badger().src);
	srcs.add(SpriteLib.shark().src);
	srcs.add(SpriteLib.werewolf().src);
	srcs.add(SpriteLib.goose().src);
	srcs.add(SpriteLib.grab().src);
	srcs.add(SpriteLib.pickAxe().src);
	srcs.add(SpriteLib.tile("Grass").src);
	srcs.add(SpriteLib.tile("Water").src);

	srcs.add(SpriteLib.spaceship().src);

	let loader = app.loader;
	srcs.forEach(src => loader.add(src));

	loader.load(() => setupAfterLoad(game));
};

const setupAfterLoad = game => {

	if (true) {
		setupAfterLoad2_Player(game);
	}

	// UI
	if (true) {
		setupAfterLoad2_UI(game);
	}

	// land
	if (true) {
		let grid = Game.grid(game);
		let landPlan = makeLandPlan(game, grid);
		game.landPlan = landPlan;
		// // sprites
		// const w = SpriteLib.tile("water");
		// w.x = 48; w.y=48;
		// makePixiSprite(game, w, "water00", game.containerFor.characters);
		// makePixiSprite(game, SpriteLib.tile("grass"), "grass11", game.containerFor.ground);
		for(let rowi = 0; rowi<landPlan.length; rowi++) {
			for(let coli = 0; coli<landPlan[0].length; coli++) {
				let cell = landPlan[rowi][coli];
				let tileSprite = SpriteLib.tile(cell);
				Game.setTile({game, row:rowi, column:coli, tile:tileSprite});
				makePixiSprite(game, tileSprite, tileSprite.name, game.containerFor.ground);
			}
		}
	}
};

const setupAfterLoad2_Player = game => {
	let spaceship = new Sprite();	
	let sprite = makePixiSprite(game, SpriteLib.goose(), "player0", game.characters);

	let right = new Key(KEYS.ArrowRight);
	let left = new Key(KEYS.ArrowLeft);
	let up = new Key(KEYS.ArrowUp);
	let down = new Key(KEYS.ArrowDown);

	right.press = () => Game.handleInput({input:'right', on:true});
	right.release = () => Game.handleInput({input:'right', on:false});
	left.press = () => Game.handleInput({input:'left', on:true});
	left.release = () => Game.handleInput({input:'left', on:false});
	up.press = () => Game.handleInput({input:'up', on:true});
	up.release = () => Game.handleInput({input:'up', on:false});
	down.press = () => Game.handleInput({input:'down', on:true});
	down.release = () => Game.handleInput({input:'down', on:false});
};

/**
 * 
 * @param {!Game} game 
 */
const setupAfterLoad2_UI = game => {
	if (true) {
		setupAfterLoad2_UI2_goose();
		return;
	}
	let pg = new PIXI.Graphics();
	pg.beginFill(0x66CCFF);
	pg.drawCircle(10,10,20);
	pg.endFill();
	game.containerFor.world.addChild(pg);
	return true;	
};

/**
 * 
 * @param {!Game} game 
 */
const setupAfterLoad2_UI2_goose = game => {
	{	// tile shine
		let selectTile = new Sprite();
		let pSprite = new PIXI.Graphics();
		pSprite.beginFill(0xFFCCFF, 0.1);
		pSprite.lineStyle(3, 0xFF3300, 0.5);
		pSprite.drawRect(0, 0, 48, 48);
		pSprite.endFill();			
		selectTile.pixi = pSprite;
	
		Sprite.setPixiProps(selectTile);
		game.containerFor.ui.addChild(pSprite);
		game.sprites.selectTile = selectTile;
	}		

	// Create the inventory bar
	let icons = 10;
	const xOffset = 10, slotWidth=50; 
	let width = icons*slotWidth + 2*xOffset;
	const stage = game.app.stage;
	const inventoryBar = new PIXI.Container();
	inventoryBar.name = "inventoryBar";
	const grid = Game.grid(game);
	inventoryBar.position.set((grid.screenWidth - width) / 2, grid.screenHeight - 200);
	console.log("inventoryBar",inventoryBar);
	game.containerFor.ui.addChild(inventoryBar);

	//Create the black background rectangle
	let innerBar = new PIXI.Graphics();
	innerBar.lineStyle(4, 0xFF3300, 1);
	innerBar.beginFill(0xCCFFFF);
	innerBar.drawRoundedRect(0, 0, width, 50, 10);
	innerBar.endFill();
	inventoryBar.addChild(innerBar);

	// default inventory	
	let slot = 0;
	{	// grab FIXME no show?!
		let grabSprite = new Tile(SpriteLib.grab());
		grabSprite = makePixiSprite(game, SpriteLib.grab(), "grab", inventoryBar);
		grabSprite.x = xOffset + slot*slotWidth;
		Sprite.setPixiProps(grabSprite); // Tiles dont update so we have to prod the pixi xy
		slot++;
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
		grabSprite.x = xOffset + slot*slotWidth;
		slot++;
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
	// spawns
	// NB shark is bigger than 48x48
	['sheep','goat','chicken','wolf','frog','fish','badger','werewolf'].forEach(spawnName => {
		// use Tile so no updates
		let base = new Tile(SpriteLib[spawnName]());
		let iSprite = makePixiSprite(game, base, "inventory-"+spawnName, inventoryBar);
		// iSprite.animate = null;
		iSprite.x = xOffset + slot*slotWidth;
		Sprite.setPixiProps(iSprite); // Tiles dont update so we have to prod the pixi xy
		slot++;
		let psprite = iSprite.pixi;
		psprite.interactive = true;
		const onDown = e => {
			console.log("onDown",e, ""+e.target);
			let player = game.sprites.player0;
			// copy from Tile to Sprite, and move it
			let spawn = new Sprite(iSprite);

			let kind = game.kinds[spawn.kind];
			if (kind) {
				spawn.speed = kind.speed; // HACK
			}
			
			spawn['@type'] = 'Sprite'; // HACK: not a Tile anymore
			// shine square
			let birthPlace = game.sprites.selectTile || player;
			spawn.x = birthPlace.x;
			spawn.y = birthPlace.y;
			makePixiSprite(game, spawn, iSprite.name+nonce(), game.containerFor.characters);				
		};
		psprite.on('mousedown', onDown);
		psprite.on('touchstart', onDown);
	});		
};



Game.setup = game => {
	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';

	// Creatures	
	Game.addKind(game, Sheep);
	Game.addKind(game, Chicken);
	Game.addKind(game, Goat);
	Game.addKind(game, Wolf);
	Game.addKind(game, Werewolf);
	Game.addKind(game, Fish);
	Game.addKind(game, Frog);
	Game.addKind(game, Badger);

	Game.basicPixiSetup(game);

};

/**
 * 
 * @param {Game} game 
 * @param {Grid} grid 
 */
const makeLandPlan = (game, grid) => {
	let nrows = Math.floor(grid.screenHeight / grid.tileHeight);
	let ncols = Math.floor(grid.screenWidth / grid.tileWidth);
	assert(nrows > 1, game);
	assert(ncols > 1, game);
	let map = [];
	for(let ri=0; ri<nrows; ri++) {
		let row = [];
		map.push(row);
		for(let ci=0; ci<ncols; ci++) {
			let r = Math.floor(Math.random()*3);
			let tile = ['Grass','Water','Earth'][r];
			row.push(tile);
		}
	}
	return map;
};


export default {}; // dummy export to keep imports happy
