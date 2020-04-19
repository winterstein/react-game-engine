
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
import Trex from './creatures/Trex';
import Wood from './creatures/Wood';
import Tree from './creatures/Tree';
import Frog from './creatures/Frog';
import Player from './creatures/Player';
import KindOfCreature from './creatures/KindOfCreature';
import { addScript } from 'wwutils';
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
	srcs.add(SpriteLib.shark().src);
	// srcs.add(SpriteLib.goose().src);

	srcs.add(SpriteLib.icon('Grab').src);
	srcs.add(SpriteLib.icon('PickAxe').src);
	srcs.add(SpriteLib.icon('Switch').src);
	srcs.add(SpriteLib.icon('Meat').src);
	srcs.add(SpriteLib.icon('Wood').src);
	srcs.add(SpriteLib.icon('Egg').src);

	srcs.add(SpriteLib.tile("Earth").src);
	srcs.add(SpriteLib.tile("Grass").src);
	srcs.add(SpriteLib.tile("Water").src);
	srcs.add(SpriteLib.tile("Tree").src);

	let loader = papp.loader;
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
	// pick the tiles (unless this is a loaded game)
	let landPlan = game.landplan || makeLandPlan(game, grid);
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
		Game.addSprite({game, sprite:bg, id:'bg'+nonce(), container:containerFor.ground});
		Game.addSprite({game, sprite:tileSprite, id:tileSprite.name, container:containerFor.characters});
	} else {
		Game.addSprite({game, sprite:tileSprite, id:tileSprite.name, container:containerFor.ground});
	}

	// make creatures to swim and roam the land?
	let critter = null;
	if (cell==='Water' && Math.random() < 0.2) {				
		if (Math.random() < 0.75) critter = 'Fish';
		else critter = 'Frog';
	}
	if (cell==='Tree' && Math.random() < 0.20) {
		critter = 'Badger';
	}
	if (cell==='Grass' && Math.random() < 0.01) {				
		critter = 'Bunny';
	}
	if (critter) {
		let c = Game.make(critter, {x:tileSprite.x, y:tileSprite.y});
	}
};


const setupAfterLoad2_Player = game => {
	let sprite = Game.addSprite({game, sprite:SpriteLib.goose(), id:"player0", container:game.characters});
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
	space.press = Player.doAttack;
	let u = new Key("u");
	u.press = Player.doUse;
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
		setPSpriteFor(selectTile, pSprite);
	
		Sprite.setPixiProps(selectTile);
		containerFor.ui.addChild(pSprite);
		game.sprites.selectTile = selectTile;
	}		

	// Create the inventory bar
	let icons = 11;
	const xOffset = 10, slotWidth=50; 
	let width = icons*slotWidth + 2*xOffset;
	const stage = getPApp().stage;
	const inventoryBar = new PIXI.Container();
	inventoryBar.name = "inventoryBar";
	const grid = Game.grid(game);
	inventoryBar.position.set((grid.screenWidth - width) / 2, grid.screenHeight - 50 - 2*grid.vh);
	console.log("inventoryBar",inventoryBar);
	containerFor.ui.addChild(inventoryBar);

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
	if (false) {	// grab
		let onClick = Player.doUse;
		setupAfterLoad3_UI2_addIcon({
			game, icon:SpriteLib.icon('Grab'), inventoryBar, slot, xOffset, slotWidth, onClick, keyTip:'u'
		});
		slot++;
	}
	{	// hit
		let onClick = Player.doAttack;
		setupAfterLoad3_UI2_addIcon({
			game, icon:SpriteLib.icon('PickAxe'), inventoryBar, slot, xOffset, slotWidth, onClick,
			keyTip:'space'
		});
		slot++;
	}
	if (false) {	// hit
		let onClick = () => {};
		// gear &#x2699;
		// next page &#x2398;
		setupAfterLoad3_UI2_addIcon({
			game, icon:SpriteLib.icon('Switch'), inventoryBar, slot, xOffset, slotWidth, onClick,
			keyTip:'shift'
		});
		let tab = new Key("Shift"); //	"	");
		tab.press = () => console.warn("x");	
		slot++;
	}

	let rotatingToolBar1 = new PIXI.Container();	
	rotatingToolBar1.name = 'rotatingToolBar1';
	rotatingToolBar1.x = xOffset + slot*slotWidth;
	inventoryBar.addChild(rotatingToolBar1);
	// spawns
	// NB shark is bigger than 48x48
	let rslot = 0;
	['sheep','goat','chicken','wolf','frog','bunny','fish','badger','werewolf','trex'].forEach(spawnName => {		
		let icon = SpriteLib[spawnName]();
		const onClick = e => {
			console.log("onDown",e, ""+e.target);
			let player = game.sprites.player0;
			let birthPlace = player;
			// copy from Tile to Sprite, and move it
			let spawn = Game.make(icon.kind, {x:birthPlace.x, y:birthPlace.y});			
		};
		setupAfterLoad3_UI2_addIcon({icon, xOffset:2, slot:rslot, slotWidth, game, inventoryBar:rotatingToolBar1, onClick});
		console.log(spawnName, icon);
		rslot++;
	});
	rotatingToolBar1.calculateBounds();

	if (false) {
		let rotatingToolBar2 = new PIXI.Container();	
		rotatingToolBar2.name = 'rotatingToolBar2';
		rotatingToolBar2.x = rotatingToolBar1.x;
		inventoryBar.addChild(rotatingToolBar2);
		rslot = 0;
		['Grass','Earth','Water','Tree'].forEach(spawnName => {		
			let icon = SpriteLib.tile(spawnName);
			const onClick = e => {
				console.log("onDown",e, ""+e.target);
				let player = game.sprites.player0;
				let birthPlace = player;
				// copy from Tile to Sprite, and move it
				let spawn = Game.make(icon.kind, {x:birthPlace.x, y:birthPlace.y});			
			};
			setupAfterLoad3_UI2_addIcon({icon, xOffset:2, slot:rslot, slotWidth, game, inventoryBar:rotatingToolBar2, onClick});
			console.log(spawnName, icon);
			rslot++;
		});
		rotatingToolBar1.calculateBounds();
	}

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
	const psprite = getPSpriteFor(icon);
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
