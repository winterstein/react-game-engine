
import DataStore from './base/plumbing/DataStore';
import {getClass} from './base/data/DataClass';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import Game from './Game';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from './Key';

/**
 * 
 * @param {!Sprite} spriteSpec 
 * @returns {Sprite} having set sprite.pixi
 */
const makePixiSprite = (game, sprite, name) => {
	Game.assIsa(game);
	Sprite.assIsa(sprite);
	let psprite = new PIXI.Sprite(app.loader.resources[sprite.src].texture);
	psprite.texture.frame = new PIXI.Rectangle(0,0,48,48);
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

	app.loader
	.add("/img/animals.TP.json")
	.add(SpriteLib.alligator().src)
	.add(SpriteLib.goat().src)
	  .load(() => setupAfterLoad(game));
}

const setupAfterLoad = game => {

	let sprite = makePixiSprite(game, SpriteLib.goat());

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
		switch(input) {
			case 'up':
				if (on) sprite.dy = -1;
				if ( ! on && sprite.dy === -1) sprite.dy = 0;
				break;
			case 'down':
				if (on) sprite.dy = 1;
				if ( ! on && sprite.dy === 1) sprite.dy = 0;
				break;
			case 'left':
				if (on) sprite.dx = -1;
				if ( ! on && sprite.dx === -1) sprite.dx = 0;
				break;
			case 'right':
				if (on) sprite.dx = 1;
				if ( ! on && sprite.dx === 1) sprite.dx = 0;
				break;
		}
		console.log(sprite.dx + " dy: "+sprite.dy, sprite);
	};

	// TODO land
	let landPlan = makeLandPlan(game);
	// TODO sprites
	for(let rowi = 0; rowi<landPlan.length; rowi++) {
		for(let coli = 0; coli<landPlan[0].length; coli++) {
			let cell = landPlan[rowi][coli];
			
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

makeLandPlan = game => {
	return [['grass','grass','grass'],['water','grass','water'],['grass','grass','grass']];
};


export default {}; // dummy export to keep imports happy
