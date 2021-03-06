/**
 * Let's define some nice sprites for easy use :)
 * 
 * Better (faster rendering, cleaner code) would be to have a sprites json file. But making that is a faff, and it lacks flexibility.
 */
import Sprite from './Sprite';
import Tile from './Tile';
import * as PIXI from 'pixi.js';
import { setPSpriteFor } from '../components/Pixies';
import { nonce } from '../base/data/DataClass';

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
	if (name==='Wood') sp.tileSize=[32,32]; // HACK
	return sp;
};
const ICONS = {
	Grab: '/img/icon/hand-grab.png',
	PickAxe: '/img/icon/pick-axe.png',
	Switch: '/img/icon/icons8-switch-50.png',
	Egg: '/img/icon/noun_Egg_3194757.png',
	Meat: '/img/icon/icons8-meat-30.png',
	Wood: '/img/icon/icons8-wood-32.png'
};

/**
 * Make an icon from some text
 */
SpriteLib.textAsIcon = ({name, text}) => {
	let sp = new Tile({	// NB: Tile so it doesnt get updates, or copied into a Tile by game-setup
		tileSize: [48,48],
		name,
		kind: 'Icon',
		id: 'icon'+name+nonce()	
	});
	// wire to pixi
	let psprite = new PIXI.Container();
	setPSpriteFor(sp, psprite);
	
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
SpriteLib.allosaurus = () => {
	// a bit taller
	let sbase = {
		kind: 'Allosaurus',
		src: '/img/animals/allosaurus.png',
		tiles: [1,4],
		tileSize: [70,67],
		animations: {
			left: {frames:[2,3]}, 
			right: {frames:[0,1]}, 
			// up: {frames:[36+n*3,37+n*3,38+n*3]}, 
			// down: {frames:[0+n*3,1+n*3,2+n*3]} 
		},
	};
	let sp = new Sprite(sbase);
	// ??starting animation??
	Sprite.initFrames(sp);
	Sprite.animate(sp, 'right');
	return sp;
};

SpriteLib.BlueShark = () => {
	// a bit taller
	let sbase = {
		kind: 'BlueShark',
		src: '/img/blue-shark.png',
		tiles: [1,1],
		tileSize: [128,67],
		// animations: {
		// 	left: {frames:[2,3]}, 
		// 	right: {frames:[0,1]}, 
		// 	// up: {frames:[36+n*3,37+n*3,38+n*3]}, 
		// 	// down: {frames:[0+n*3,1+n*3,2+n*3]} 
		// },
	};
	let sp = new Sprite(sbase);
	// ??starting animation??
	Sprite.initFrames(sp);
	// Sprite.animate(sp, 'right');
	return sp;
};


SpriteLib.beaver = () => {
	// a bit taller
	let sbase = {
		kind: 'Beaver',
		src: '/img/animals/josh-beaver.png',
		tiles: [1,2],
		tileSize: [48,48],
		animations: {
			left: {frames:[0]}, 
			right: {frames:[1]}, 
			// up: {frames:[36+n*3,37+n*3,38+n*3]}, 
			// down: {frames:[0+n*3,1+n*3,2+n*3]} 
		},
	};
	let sp = new Sprite(sbase);
	// ??starting animation??
	Sprite.initFrames(sp);
	Sprite.animate(sp, 'right');
	return sp;
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
 * 
 * @param {*} src 
 * @param {*} n 
 * @param {*} kind 
 * @param {?Object} base 
 */
SpriteLib.spaceship = (base) => {
	let sbase = Object.assign({
		kind:'Spaceship',
		src:'/img/spaceship.png',
	}, base);
	let sp = new Sprite(sbase);
	return sp;
};


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
