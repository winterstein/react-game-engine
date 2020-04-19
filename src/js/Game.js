/**
 * Base class for Games
 */
import DataStore from './base/plumbing/DataStore';
import DataClass, {getClass, nonce} from './base/data/DataClass';
import Sprite from './data/Sprite';
import Rect from './data/Rect';
import StopWatch from './StopWatch';
import {assert, assMatch} from 'sjtest';
import Grid from './data/Grid';
import Tile from './data/Tile';
import * as PIXI from 'pixi.js';
import { randomPick } from './base/utils/miscutils';
import Pixies, { containerFor, setPSpriteFor, getPSpriteFor } from './components/Pixies';

class Game extends DataClass {

	id = nonce();
	
	/**
	 * String to Sprite
	 */
	sprites = {};

	/** @type {StopWatch}  */
	ticker = new StopWatch();

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

const doSave = game => {
	console.log("saving... "+game.id);
	let json = JSON.stringify(game);
	let gameIds = JSON.parse(window.localStorage.getItem("gameIds") || "[]");
	if ( ! gameIds.includes(game.id)) {
		gameIds.push(game.id);
		window.localStorage.setItem("gameIds", JSON.stringify(gameIds));
	}
	window.localStorage.setItem("game"+game.id, json);
};

const doLoad = gameId => {
	console.log("loading... "+gameId);
	if ( ! gameId) {
		let gameIds = JSON.parse(window.localStorage.getItem("gameIds") || "[]");
		if ( ! gameIds || ! gameIds.length) return null;
		gameId = gameIds[gameIds.length-1];
	}
	let json = window.localStorage.getItem("game"+gameId);
	if ( ! json) return null;
	return JSON.parse(json);
};

Game.setAutoSave = onOff => {
	if ( ! onOff) {
		return;
	}
	let huh = setInterval(() => {
		doSave(Game.get());
	}, 5000);
	console.warn("autosave", huh);
};

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
Game.handleInput = ({sprite, input, dx, dy, on}) => {
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
	case 'dxdy':
		if (on) {
			if (Math.abs(dx)<10 && Math.abs(dy)<10) {
				on = false;
			} else {
				// normalise
				const dd = Math.sqrt(dx*dx + dy*dy);
				dx /= dd;
				dy /= dd;				
				sprite.dx = v*dx;
				sprite.dy = v*dy;
			}
		}
		if ( ! on ) {
			sprite.dx = 0;
			sprite.dy = 0;
		}
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
 * @param {?String[]} types
 * @param {?Number} limit in tiles eg 5. If set, ignore sprites further away than this
 * @returns {?Sprite}
 */
Game.getNearest = ({sprite, game, types, limit, tile=false, filter}) => {	
	let sprites = Object.values(game.sprites);
	// no Tiles
	if ( ! tile) {
		sprites = sprites.filter(s => ! Tile.isa(s));
	}
	// type filter
	if (types) sprites = sprites.filter(s => types.includes(s.kind));
	// ad-hoc filter
	if (filter) sprites = sprites.filter(filter);
	// not self
	sprites = sprites.filter(s => s !== sprite);	

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
 * @param {!String} kind
 * @returns {!Sprite[]}
 */
Game.getAllSprites = (kind) => {
	let game = Game.get();	
	let sprites = Object.values(game.sprites);
	sprites = sprites.filter(s => kind === s.kind);
	return sprites;
};

/**
 * xy distance squared
 * @param {!Sprite} s1 
 * @param {!Sprite} s2 
 */
const dist2 = (s1, s2) => (s1.x-s2.x)*(s1.x-s2.x) + (s1.y-s2.y)*(s1.y-s2.y);

/**
 * @param {Game} game
 * @returns {!Grid}
 */
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
	// game.sprites[tile.name] = tile; Done in Game.addSprite
};

/**
 * @param {!Game} game
 */
Game.kinds = game => game.kinds;

/**
 * @param {?Game} game
 * @param {!KindOfCreature} kind
 */
Game.addKind = (game, kind) => {
	if ( ! game) game = Game.get();
	Game.assIsa(game);
	game.kinds[kind.name] = kind;
};

/**
 * Easy way to make a sprite
 * @param kindName {!String} name of a KindOfCreature
 */
Game.make = (kindName, spriteSettings={}) => {
	const game = Game.get();
	const kind = game.kinds[kindName];
	if ( ! kind) {
		throw new Error("Cannot make "+kindName+" - kind unknown");
	}	
	let base = randomPick(kind.sprites) || {};
	// TODO (but: bugs) copy in Kind props - but early, so the end object is a Sprite 
	const freshBase = Object.assign({}, base, kind);
	let sprite = new Sprite(freshBase);
	delete sprite.sprites; // keep our sprite a json blob - no circular refs
	sprite.kind = kindName;
	sprite['@type'] = 'Sprite';
	sprite.speed = kind.speed; // HACK
	sprite.attack = kind.attack; // HACK
	const id = kindName+nonce();
	// special settings? often x and y
	if (spriteSettings) {
		sprite = Object.assign(sprite, spriteSettings);
	}
	Game.addSprite({game, sprite, id, container:containerFor.characters});
	return sprite;
};

/**
 * Add a sprite to game, plus make a Pixi sprite and add to container.
 * @param {?String} id a nonce will be made if blank. Cannot be a duplicate
 */
Game.addSprite = ({game, sprite, id, container}) => {
	Game.assIsa(game);
	Sprite.assIsa(sprite);
	if (id) sprite.id = id;
	if ( ! sprite.id) sprite.id = sprite.kind+nonce();
		
	assert( ! game.sprites[sprite.id], "Duplicate sprite for "+sprite.id);
	game.sprites[sprite.id] = sprite;
	
	let psprite = new PIXI.Sprite();
	setPSpriteFor(sprite, psprite);

	Sprite.setPixiProps(sprite);

	// sprite parts?
	if (sprite.background && false) {
		let bgsprite = new PIXI.Sprite();	
		Sprite.setPixiProps(bgsprite);
		// TODO add to container
	}

	if ( ! container) container = containerFor.world;
	container.addChild(psprite);

	return sprite;
};

Game.removeSprite = (game, sprite) => {
	// console.log("removeSprite", sprite);
	Sprite.assIsa(sprite);
	delete game.sprites[sprite.id];
	// clean up Pixi
	const psprite = getPSpriteFor(sprite);
	if (psprite) {		
		if (psprite.parent) psprite.parent.removeChild(psprite);
		psprite.destroy({children:true});
		setPSpriteFor(sprite, null);
	}
};

window.Game = Game; //debug
export default Game;

export {
	dist2,
	doSave, doLoad
};
