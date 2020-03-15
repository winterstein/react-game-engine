
import DataStore from './base/plumbing/DataStore';
import {getClass} from './base/data/DataClass';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import Game from './Game';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from './Key';
import { assMatch } from 'sjtest';

/**
 * @param {!Game} game
 * @param {!Sprite} sprite An instance of a sprite
 * @returns {Sprite} sprite, having set sprite.pixi
 */
const makePixiSprite = (game, sprite, name) => {
	Game.assIsa(game);
	Sprite.assIsa(sprite);
	assMatch(name, String);
	let pres = app.loader.resources[sprite.src];
	assert(pres, "Not loaded Pixi resource "+sprite.src);
	let psprite = new PIXI.Sprite(pres.texture);
	const w = sprite.tileSize? sprite.tileSize[0] : 48;
	const h = sprite.tileSize? sprite.tileSize[1] : 48;
	psprite.texture.frame = new PIXI.Rectangle(0,0,w,h);
	sprite.pixi = psprite;

	game.world.addChild(psprite);
	game.sprites[name] = sprite;
	sprite.x = 10;
	sprite.y = 10;
	sprite.dx = 0;
	sprite.dy = 0;

	return sprite;
};

/**
 * @param {!Game} game
 */
Game.basicPixiSetup = game => {
	if ( ! game.app) {
		game.app = new PIXI.Application(window.innerWidth, window.innerHeight);
		window.app = game.app;
	}
	
	const app = game.app;
	// a handy container for the game world, to separate it from UI
	const world = new PIXI.Container();
	app.stage.addChild(world);
	game.world = world;

	// Tiles for the background
	let ground = new PIXI.ParticleContainer();
	world.addChild(ground);

	app.loader
	.add("/img/animals.TP.json")
	.add(SpriteLib.alligator().src)
	.add(SpriteLib.goat().src)
	.add(SpriteLib.tile("grass").src)
	  .load(() => setupAfterLoad(game));
}

const setupAfterLoad = game => {

	let sprite = makePixiSprite(game, SpriteLib.goat(), "player0");

	let right = new Key(KEYS.ArrowRight);
	let left = new Key(KEYS.ArrowLeft);
	let up = new Key(KEYS.ArrowUp);
	let down = new Key(KEYS.ArrowDown);

	right.press = () => Game.handleInput({input:'right', on:true});
	right.press = () => Game.handleInput({input:'right', on:false});
	left.press = () => Game.handleInput({input:'left', on:true});
	left.press = () => Game.handleInput({input:'left', on:false})
	up.press = () => Game.handleInput({input:'up', on:true});
	up.press = () => Game.handleInput({input:'up', on:false})
	down.press = () => Game.handleInput({input:'down', on:true});
	down.press = () => Game.handleInput({input:'down', on:false})

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
				if (on) sprite.dx = -v;
				if ( ! on && sprite.dx < 0) sprite.dx = 0;
				break;
			case 'right':
				if (on) sprite.dx = v;
				if ( ! on && sprite.dx > 0) sprite.dx = 0;
				break;
		}
		console.log(sprite.dx + " dy: "+sprite.dy, sprite);
	};

	// land
	let landPlan = makeLandPlan(game);
	// sprites
	for(let rowi = 0; rowi<landPlan.length; rowi++) {
		for(let coli = 0; coli<landPlan[0].length; coli++) {
			let cell = landPlan[rowi][coli];
			let tileSprite = SpriteLib.tile(cell);
			tileSprite.x = coli * 10;
			tileSprite.y = rowi * 10;
			makePixiSprite(game, tileSprite, "row"+rowi+"_col"+coli);
		}
	}
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
	return [['grass','grass','grass'],['water','grass','water'],['grass','grass','grass']];
};


export default {}; // dummy export to keep imports happy
