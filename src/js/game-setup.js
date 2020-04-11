
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
import Sheep from './creatures/Sheep';
import Fish from './creatures/Fish';
import Wolf from './creatures/Wolf';
import Chicken from './creatures/Chicken';
import Bunny from './creatures/Bunny';
import Badger from './creatures/Badger';
import Goat from './creatures/Goat';
import Werewolf from './creatures/Werewolf';
import Frog from './creatures/Frog';
import KindOfCreature from './creatures/KindOfCreature';
import { addScript } from 'wwutils';
import pJoyRing from './components/pJoyRing';

const DEBUG_FOCUS = false;

/**
 * @param {!Game} game
 * @param {!Sprite} sprite An instance of a sprite
 * @param {!String} id Unique
 * @returns {Sprite} sprite, having set sprite.pixi
 */
const makePixiSprite = (game, sprite, id, container) => {
	return Game.addSprite({game,sprite,id,container});
};

/**
 * @param {!Game} game
 */
Game.basicPixiSetup = game => {
	if ( ! game.app) {
		let grid = Game.grid(game);
		grid.screenWidth = window.innerWidth; // ??how to manage the browser address bar and UI blocking part of the screen??
		grid.screenHeight = window.innerHeight;
		grid.vw = grid.screenWidth/100;
		grid.vh = grid.screenHeight/100;
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
	srcs.add(SpriteLib.goat().src);
	srcs.add(SpriteLib.frog().src);
	srcs.add(SpriteLib.badger().src);
	srcs.add(SpriteLib.chicken().src);
	srcs.add(SpriteLib.bunny().src);
	srcs.add(SpriteLib.shark().src);
	srcs.add(SpriteLib.werewolf().src);
	srcs.add(SpriteLib.goose().src);

	srcs.add(SpriteLib.icon('Grab').src);
	srcs.add(SpriteLib.icon('PickAxe').src);
	srcs.add(SpriteLib.icon('Meat').src);
	srcs.add(SpriteLib.icon('Egg').src);

	srcs.add(SpriteLib.tile("Earth").src);
	srcs.add(SpriteLib.tile("Grass").src);
	srcs.add(SpriteLib.tile("Water").src);
	srcs.add(SpriteLib.tile("Tree").src);

	let loader = app.loader;
	srcs.forEach(src => loader.add(src));

	loader.load(() => setupAfterLoad(game));
};

/**
 * 
 * @param {!Game} game 
 */
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
		setupAfterLoad2_land(game);
	}
};


const setupAfterLoad2_land = game => {
	let grid = Game.grid(game);
	// pick the tiles
	let landPlan = makeLandPlan(game, grid);
	game.landPlan = landPlan;
	// add the tiles to the game
	for(let rowi = 0; rowi<landPlan.length; rowi++) {
		for(let coli = 0; coli<landPlan[0].length; coli++) {
			setupLandTile({landPlan,rowi,coli,game,grid});
		}
	}
};

const setupLandTile = ({landPlan, rowi, coli, game, grid}) => {
	let cell = landPlan[rowi][coli];
	let tileSprite = SpriteLib.tile(cell);
	Game.setTile({game, row:rowi, column:coli, tile:tileSprite});
	if (cell==='Tree') { // HACK
		let bg = SpriteLib.tile('Earth');
		bg.x = tileSprite.x;
		bg.y = tileSprite.y;
		bg.width=grid.tileWidth;
		bg.height=grid.tileHeight;
		Game.addSprite({game, sprite:bg, id:'bg'+nonce(), container:game.containerFor.ground});
		Game.addSprite({game, sprite:tileSprite, id:tileSprite.name, container:game.containerFor.characters});
	} else {
		Game.addSprite({game, sprite:tileSprite, id:tileSprite.name, container:game.containerFor.ground});
	}

	// make creatures to swim and roam the land?
	if (cell==='Water' && Math.random() < 0.3) {				
		let fish = Game.make('Fish');
		fish.x = tileSprite.x;
		fish.y = tileSprite.y;
	}
	if (cell==='Tree') {
		let badger = Game.make('Badger');
		badger.x = tileSprite.x;
		badger.y = tileSprite.y;
	}
	if (cell==='Grass' && Math.random() < 0.01) {				
		let fish = Game.make('Bunny');
		fish.x = tileSprite.x;
		fish.y = tileSprite.y;
	}
};


const setupAfterLoad2_Player = game => {
	let sprite = makePixiSprite(game, SpriteLib.goose(), "player0", game.characters);
	const grid = Game.grid(game);
	sprite.x = grid.vw*45;
	sprite.y = grid.vh*45;
	sprite.attack = 100; // 1 hit kill

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

	let space = new Key(" ");
	space.press = playerAttack;
};

const playerAttack = () => {
	const game = Game.get();
	let player = game.sprites.player0;
	let nearbySprite = Game.getNearest({sprite:player, game, limit:1});
	if (nearbySprite) {
		KindOfCreature.doBite(player, nearbySprite);
		// TODO a sparkle effect on the pickaxe
	} else {
		console.log("Nothing to hit");
	}
};

/**
 * 
 * @param {!Game} game 
 */
const setupAfterLoad2_UI = game => {
	if (false) {	// tile shine - nah
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
	let icons = 11;
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
	innerBar.calculateBounds();
	inventoryBar.addChild(innerBar);

	// default inventory	
	let slot = 0;	
	if (true) {	// grab
		let onClick = e => {console.warn("TODO",e)};
		setupAfterLoad3_UI2_addIcon({
			game, icon:SpriteLib.icon('Grab'), inventoryBar, slot, xOffset, slotWidth, onClick
		});
		slot++;
	}
	{	// hit
		let onClick = playerAttack;
		setupAfterLoad3_UI2_addIcon({
			game, icon:SpriteLib.icon('PickAxe'), inventoryBar, slot, xOffset, slotWidth, onClick,
			keyTip:'space'
		});
		slot++;
	}	
	// spawns
	// NB shark is bigger than 48x48
	['sheep','goat','chicken','wolf','frog','bunny','fish','badger','werewolf'].forEach(spawnName => {		
		let icon = SpriteLib[spawnName]();
		const onClick = e => {
			console.log("onDown",e, ""+e.target);
			let player = game.sprites.player0;
			// copy from Tile to Sprite, and move it
			let spawn = Game.make(icon.kind);			
			// spawn['@type'] = 'Sprite'; // HACK: not a Tile anymore
			// shine square
			let birthPlace = player;
			spawn.x = birthPlace.x;
			spawn.y = birthPlace.y;
		};
		setupAfterLoad3_UI2_addIcon({icon, xOffset, slot, slotWidth, game, inventoryBar, onClick});		
		console.log(spawnName, icon);
		slot++;
	});		

	// control ring
	if (isMobile()) {
		const pjoyRing = pJoyRing({game});
	}
};


const setupAfterLoad3_UI2_addIcon = ({icon, xOffset, slot, slotWidth, game, inventoryBar, onClick, keyTip}) => {
	// use Tile so no updates
	if ( ! Tile.isa(icon)) {
		icon = new Tile(icon);
		Sprite.animate(icon,'right');
		if (icon.animate && icon.animate.frames) {
			icon.frameIndex = icon.animate.frames[0];
		}
	}
	icon.x = xOffset + slot*slotWidth;
	Game.addSprite({game, sprite:icon, container:inventoryBar});	
	// Sprite.setPixiProps(grabSprite); // Tiles dont update so we have to prod the pixi xy
	let psprite = icon.pixi;			
	psprite.interactive = true;
	psprite.cursor = 'pointer';
	psprite.on('mousedown', onClick);
	psprite.on('touchstart', onClick);
	// key tip
	if (keyTip && ! isMobile()) {
		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 10,
			// fontStyle: 'italic',
			// fontWeight: 'bold',
			// fill: ['#ffffff', '#00ff99'], // gradient
			// stroke: '#333',
			// strokeThickness: 1,
			dropShadow: true,
			dropShadowColor: '#ffffff',
			dropShadowBlur: 3,
			// dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 3,
			// wordWrap: true,
			// wordWrapWidth: 440,
		});
		const basicText = new PIXI.Text('('+keyTip+')', style);
		basicText.x = 15;
		basicText.y = 40;
		psprite.addChild(basicText);
	}
};

Game.setup = game => {
	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';

	// Load from github?
	// from github fails addScript("https://raw.githubusercontent.com/winterstein/react-game-engine/master/src/js/creatures/Chicken.js", {});
	// works but slow addScript("https://raw.githack.com/winterstein/react-game-engine/master/src/js/creatures/Chicken.js", {});

	// fetch("https://raw.githubusercontent.com/winterstein/react-game-engine/master/src/js/creatures/Chicken.js")
	// .then(res => {
	// 	console.warn("res",res);
	// 	res.text().then(txt => {
	// 		Function(txt)();
	// 	});
	// });
	
	// Creatures	
	Game.addKind(game, Sheep);
	Game.addKind(game, Chicken);	
	Game.addKind(game, Bunny);
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
	let nrows = Math.ceil(grid.screenHeight / grid.tileHeight);
	let ncols = Math.ceil(grid.screenWidth / grid.tileWidth);
	grid.width = ncols;
	grid.height = nrows;
	assert(nrows > 1, game);
	assert(ncols > 1, game);
	let map = [];
	for(let ri=0; ri<nrows; ri++) {
		let row = [];
		map.push(row);
		for(let ci=0; ci<ncols; ci++) {
			let r = Math.floor(Math.random()*3);
			let tile = ['Grass','Water','Earth'][r];
			// a few trees
			if (tile==='Earth' && Math.random()<0.25) tile='Tree';
			row.push(tile);
		}
	}
	return map;
};


export default {}; // dummy export to keep imports happy
