
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
 */
const makePixiSprite = spriteSpec => {
	let sprite = new PIXI.Sprite(app.loader.resources[spriteSpec.src].texture);
	sprite.texture.frame = new PIXI.Rectangle(0,0,48,48);
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

	const world = game.world;
	let sprite = makePixiSprite(SpriteLib.goat());
	world.addChild(sprite);

	let bsprite = new PIXI.Sprite(app.loader.resources["/img/animals.TP.json"].textures['bunny/bunny-0.png']);
	app.stage.addChild(bsprite);
	bsprite.dx = 0;

	let right = new Key(KEYS.ArrowRight);
	let left = new Key(KEYS.ArrowLeft);

	right.press = () => bsprite.dx = 1;
	right.release = () => left.isUp? bsprite.dx = 0 : null;
	
	left.press = () => bsprite.dx = -1;
	left.release = () => right.isUp? bsprite.dx = 0 : null;
};


Game.setup = game => {
	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';
	Game.grid = grid;

	Game.basicPixiSetup(game);
};

export default {}; // dummy export to keep imports happy
