/**
 * Let's define some nice sprites for easy use :)
 */
import Sprite from './Sprite';
import Tile from './Tile';
import { assert } from 'sjtest';
import * as PIXI from 'pixi.js';

const SpriteLib = {};

/**
 * 
 * @param {*} src 
 * @param {*} n 
 * @param {*} kind 
 * @param {?Object} base 
 */
const stdAnimal = (src,n=0,kind,base) => {
	let sbase = Object.assign({
		kind,
		src,
		tiles: [8,12],
		tileSize: [48,48],
		animations: {
			left: {frames:[12+n*3,13+n*3,14+n*3,13+n*3]}, 
			right: {frames:[24+n*3,25+n*3,26+n*3,25+n*3]}, 
			up: {frames:[36+n*3,37+n*3,38+n*3]}, 
			down: {frames:[0+n*3,1+n*3,2+n*3]} 
		},
	}, base);
	let sp = new Sprite(sbase);
	// ??starting animation??
	Sprite.initFrames(sp);
	Sprite.animate(sp, 'right');
	return sp;
};

/**
 * @returns {!Sprite}
 */
SpriteLib.icon = name => {	
	const src = ICONS[name];
	assert(src, "no icon file "+name);
	let sp = new Sprite({
		tileSize: [48,48],
		name,
		kind: 'Icon',
		src,
	});
	if (name==='Meat') sp.tileSize=[30,30]; // HACK
	return sp;
};
const ICONS = {
	Grab: '/img/icon/hand-grab.png',
	PickAxe: '/img/icon/pick-axe.png',
	Egg: '/img/icon/noun_Egg_3194757.png',
	Meat: '/img/icon/icons8-meat-30.png',
};

/**
 * Make an icon from some text
 */
SpriteLib.textAsIcon = ({name, text}) => {
	let sp = new Tile({	// NB: Tile so it doesnt get updates, or copied into a Tile by game-setup
		tileSize: [48,48],
		name,
		kind: 'Icon',		
	});
	// wire to pixi
	let psprite = new PIXI.Container();
	sp.pixi = psprite;
	
	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 16,
		// fontStyle: 'italic',
		fontWeight: 'bold',
		// fill: ['#ffffff', '#00ff99'], // gradient
		// stroke: '#333',
		// strokeThickness: 1,
		dropShadow: true,
		dropShadowColor: '#ffffff',
		dropShadowBlur: 5,
		// dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 5,
		// wordWrap: true,
		// wordWrapWidth: 440,
	});
	const basicText = new PIXI.Text(text, style);
	basicText.x = 5;
	basicText.y = 5;
	psprite.addChild(basicText);

	return sp;
};


SpriteLib.chicken = n => stdAnimal('/img/animals/chicken_large.png',n,'Chicken');

SpriteLib.bunny = n => stdAnimal('/img/animals/bunny.png',n,'Bunny');

SpriteLib.goat = n => stdAnimal('/img/animals/goats.png', n, 'Goat');

SpriteLib.goose = n => stdAnimal('/img/animals/goose.png', n, 'Goose');

SpriteLib.sheep = n => stdAnimal('/img/animals/Sheep.png', n, 'Sheep');
SpriteLib.wolf = n => stdAnimal('/img/animals/wolfdog.png', n, 'Wolf');
SpriteLib.werewolf = n => {
	// a bit taller
	let ww = stdAnimal('/img/Mythological animals/wolfbeast.png', n, "Werewolf", {tileSize:[48,52]});
	return ww;
};

SpriteLib.frog = n => stdAnimal('/img/animals/largefrog.png', n, "Frog");

SpriteLib.alligator = n => {
	let a = stdAnimal('/img/animals/alligators.png', n, 'alligator');
	// TODO mask square to rectangle to fit alligator shape
	// TODO or pixel mask logic for collisions
	return a;
};

SpriteLib.shark = () => new Sprite({
	kind:'Shark',
	src:'/img/fish/shark.png',
	tiles: [4,3],
	animate: {frames:[3,4,5], dt:400},
});

SpriteLib.fish = n => stdAnimal('/img/fish/fishtype1.png', n, 'Fish');

SpriteLib.badger = n => stdAnimal('/img/animals/badger.png', n, 'Badger');

/**
 * @param {!String} tileKind e.g. "grass"
 * @returns {Sprite}
 */
SpriteLib.tile = (tileKind) => {
	let fx=0, fy=0;
	let size=32;
	if (tileKind==='Water') {
		fy=1.5*size; fx=0.5*size;
		return new Tile({
			kind: tileKind,
			src:'/img/tiles/celianna/celianna_TileA1.png',
			// src:'/img/tilewater.png',
			tiles: [16,10],
			frameIndex:0,
			frames: [[fx,fy]],
			tileSize: [size,size],
			width:size, height:size
		});	
	}
	if (tileKind==='Earth') {
		fy=7*size;
		return new Tile({
			kind: tileKind,
			src:'/img/tiles/celianna/celianna_TileA2.png',
			tiles: [16,10],
			frameIndex:0,
			frames: [[fx,fy]],
			tileSize: [size,size],
			width:size, height:size
		});	
	}
	if (tileKind==='Tree') {
		let size2=64;
		fx=3*size2; fy=13*size2 - 10; // HACK - todo allow trees to draw over other tiles
		return new Tile({
			kind: tileKind,
			src:'/img/tiles/iso-64x64-outside.png',
			tiles: [16,10],
			frameIndex:0,
			frames: [[fx,fy]],
			tileSize: [size2,size2],
			width:size, height:size,
			background: SpriteLib.tile('Earth')
		});	
	}
	if (tileKind==='Grass' || true) {
		return new Tile({
			kind: tileKind,
			src:'/img/tiles/celianna/celianna_TileA2.png',
			// src:'/img/TileA2.png',
			tiles: [16,10],
			frameIndex:0,
			frames: [[fx,fy]],
			tileSize: [size,size],
			width:size, height:size
		});	
	}		
};


/**
 * @returns {Sprite}
 */
SpriteLib.tileIso = (tileName) => {
	console.log("tile", tileName);
	let fx=0, fy=0;
	if (tileName==='water') {
		fy=9*64; fx=5*64;
	}
	return new Sprite({
		kind: tileName,
		src:'/img/tiles/iso-64x64-outside.png',
		tiles: [16,10],
		frameIndex:0,
		frames: [[fx,fy]],
		tileSize: [64,64],
		width:64, height:64
	});
};

// TODO Tiles eg grass


window.SpriteLib = SpriteLib;
export default SpriteLib;
