/**
 * Base class for Games
 */
import DataStore from './base/plumbing/DataStore';
import DataClass, {getClass} from './base/data/DataClass';
import Sprite from './data/Sprite';
import Rect from './data/Rect';
import StopWatch from './StopWatch';
import {assert} from 'sjtest';
import Grid from './data/Grid';
import Tile from './data/Tile';

class Game extends DataClass {
	/**
	 * {String: PIXI.Container} world | ui | ground | characters
	 */
	containerFor = {};

	/**
	 * String to Sprite
	 */
	sprites = {};

	/** @type {StopWatch}  */
	ticker = new StopWatch();

	/**
	 * @type {PIXI.Application}
	 */
	app;

	width;
	
	height;

	/**
	 * @type {String : KindOfCreature}
	 */
	kinds = {};

	constructor(base) {
		super(base);
		Object.assign(this, base);
	}

	/**
	 * @return {Game} game object -- never null even pre-init. Will create if unset.
	 */
	static get() {
		return DataStore.getValue('data', 'Game') || DataStore.setValue(['data','Game'], new Game(), false);
	}

} // ./Game
DataClass.register(Game, 'Game');


Game.init = () => {
	// game object, if not already made
	const game = Game.get();
	if (game.initFlag) return;
	game.initFlag = true;
	// tick
	game.ticker = new StopWatch();

	// setup
	Game.setup(game);

	// // update loop - use request ani frame
	// let updater = setInterval(() => { Game.update(); }, game.ticker.tickLength/4); // target 1 tick

	let gameLoop = () => {
		if (game.isStopped) {
			return;
		}
		//Call this `gameLoop` function on the next screen refresh
		//(which happens 60 times per second)
		requestAnimationFrame(gameLoop);		
		Game.update(game);
	};	
	//Start the loop
	gameLoop();
};

/**
 * @param {?Sprite} sprite default to player0
 * @param {!String} input e.g. "up"
 * @param {?Boolean} on if false the input is being switched off - eg key-up
 */
Game.handleInput = ({sprite, input, on}) => {
	if ( ! sprite) {
		sprite = Game.get().sprites.player0;
	}
	const v = 100; // pixles per second
	switch(input) {
	case 'up':
		if (on) {
			sprite.dy = -v;
		}
		if ( ! on && sprite.dy < 0) sprite.dy = 0;
		break;
	case 'down':
		if (on) {
			sprite.dy = v;
		}
		if ( ! on && sprite.dy > 0) sprite.dy = 0;
		break;
	case 'left':
		if (on) {
			sprite.dx = -v;
		}
		if ( ! on && sprite.dx < 0) sprite.dx = 0;
		break;
	case 'right':
		if (on) {
			sprite.dx = v;
		}
		if ( ! on && sprite.dx > 0) sprite.dx = 0;
		break;
	}
	// console.log(input, on, sprite.dx + " dy: "+sprite.dy, sprite);
};

/**
 * @returns {Sprite}
 */
Game.getPlayer = game => {
	return game.sprites.player0;
};

/**
 * @param {!String[]} types
 * @param {?Number} limit in tiles eg 5. If set, ignore sprites further away than this
 * @returns {?Sprite}
 */
Game.getNearest = ({sprite, game, types, limit}) => {	
	let sprites = Object.values(game.sprites).filter(s => types.includes(s.kind) && s !== sprite);
	
	// no Tiles
	sprites = sprites.filter(s => ! Tile.isa(s));

	if (limit) {
		// in pixels
		const plimit = limit * Game.grid(game).tileWidth;
		const l2 = plimit*plimit;
		sprites = sprites.filter(s => dist2(sprite,s) <= l2);
	}
	// NB: assume using the top-left corner gives the same order as using sprite pivot points
	sprites.sort((a,b) => dist2(sprite, a) - dist2(sprite, b));
	return sprites[0]; // TODO sort and pick!
};
/**
 * xy distance squared
 * @param {!Sprite} s1 
 * @param {!Sprite} s2 
 */
const dist2 = (s1, s2) => (s1.x-s2.x)*(s1.x-s2.x) + (s1.y-s2.y)*(s1.y-s2.y);

Game.grid = game => {
	return Grid.get(); // just return the default
};

/**
 * @returns {{row:Number, column:Number}}
 */
Game.getTileInFront = (game, sprite) => {	
	// the sprite's tile
	let {row,column} = Game.getRowColumn(game,sprite);
	// the one in front
	if (sprite.dx) {
		if (sprite.dx>0) column++; else column--;	
	} else if (sprite.dy) {
		if (sprite.dy>0) row++; else row--;
	} else if (sprite.animate && sprite.animate.name) {
		const an = sprite.animate.name;
		switch(an) {
		case "left": column--; break;
		case "right": column++; break;
		case "up": row--; break;
		case "down": row++; break;			
		}
	}
	return {row, column};
};

/**
 * @param {!Game} game
 * @param {!Sprite} sprite
 * @returns {{row:Number, column:Number}}
 */
Game.getRowColumn = (game, sprite) => {	
	// the sprite's tile
	const half = 24; // hack to get pivot point
	let c = Math.floor((sprite.x + half) / 48);
	let r = Math.floor((sprite.y + 36) / 48); // hack plus a bit to the feet 
	return {row:r, column:c};
};

Game.getTile = ({game, row, column}) => {
	let tileName = "row"+row+"_col"+column;
	let tile = game.sprites[tileName];
	return tile;
};

/**
 * Does NOT include making a PIXI sprite, or setting game.sprites
 */
Game.setTile = ({game, row, column, tile}) => {
	Sprite.assIsa(tile);
	const grid = Game.grid(game);
	const tileWidth = grid.tileWidth;
	const tileHeight = grid.tileHeight;
	tile.x = column * tileWidth;
	tile.y = row * tileHeight;
	tile.width = tileWidth;
	tile.height = tileHeight;
	tile.name = "row"+row+"_col"+column;	
	// game.sprites[tile.name] = tile; Done in makePixiSprite
};

/**
 * @param {!Game} game
 */
Game.kinds = game => game.kinds;

/**
 * @param {!Game} game
 * @param {!KindOfCreature} kind
 */
Game.addKind = (game, kind) => {
	Game.assIsa(game);
	game.kinds[kind.name] = kind;
};

Game.removeSprite = (game, sprite) => {
	console.log("removeSprite", sprite);
	Sprite.assIsa(sprite);
	delete game.sprites[sprite.id];
	// clean up Pixi
	if (sprite.pixi && sprite.pixi.parent) {		
		sprite.pixi.parent.removeChild(sprite.pixi);
	}
};

window.Game = Game; //debug
export default Game;

export {
	dist2
};
