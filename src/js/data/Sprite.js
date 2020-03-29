
import DataClass, {getClass, getType, nonce} from '../base/data/DataClass';

import Rect from './Rect';
import Grid from './Grid';
import StopWatch from '../StopWatch';
import { assert } from 'sjtest';
import * as PIXI from 'pixi.js';


class Animate extends DataClass {
	
	/** @type {Number[]} indexes into Sprite.frames */
	frames;

	/** @type {Number} */
	dt;   

	/** @type {Boolean} */
	stop;
}
DataClass.register(Animate, 'Animate');


/** 
 * @typedef {Number[]} IntXY
*/


/**
 * 
 * Should we just use PIXI.Sprite?
 * No -- this Sprite is almost a json blob (null out pixi and it can be serialised), 
 * whilst PIXI.Sprite has a lifecycle re loaded resources, which cant be saved.
 * 
 * id: always a fresh nonce
 * src: {url}
 * x: game-x
 * y: game-y (NOT height)
 * frames: [[x,y]]
 * tiles: ?[rows, columns] in the image
 */
class Sprite extends DataClass {

	/** @type {String} e.g. "Chicken" */
	kind;

	/** @type {PIXI.Sprite} */
	pixi;

	/**
	 * @type {?Number} index into frames for the current frame
	 */
	frameIndex = 0;
	
	/**
	 * [[x,y]] coordinates into the src image
	 */
	frames;

	/**
	 * The image to use!
	 * @type {UrlString}
	 */
	src;

	/**
	 * @type {Number} game tile x
	 */
	x = 0;

	/**
	 * @type {Number} game tile y
	 */
	y = 0;

	/**
	 * @type {Number} game tile z -- NOT usually used TODO
	 */
	z = 0;

	dx = 0;

	dy = 0;

	dz = 0;

	width;

	height;

	/**
	 * @typedef {Command}
	 */
	commands = [];

	/**
	 * Use with tileSize and tileMargin to populate frames from a sprite-sheet
	 * @type {?IntXY} [num-rows, num-columns] in the image. 
	 * NB: This is "normal" for matrix dimensions, but a bit confusing if thought as as coords, as its [y,x].
	 */
	tiles;

	/**
	 * @type {Number[]} width, height -- pixel size
	 */
	tileSize;

	tileMargin;
	
	/**
	 * @type {String : Animate} name -> Animate
	 */
	animations = {};

	/**
	 * @type {Animate}
	 */
	animate;

	/**
	 * @param {?Sprite} base 
	 */
	constructor(base) {
		super(base);
		Object.assign(this, base);
		delete this.status;
	}
}
DataClass.register(Sprite, "Sprite");
export default Sprite;

/**
 * Setup frames for animation -- requires tileSize and tiles
 * @param {Sprite} sp
 */
Sprite.initFrames = sp => {
	if (sp.frames) {
		return; // all done
	}
	if ( ! sp.src) {
		console.log("Sprite.js - no url = no frames", sp);
		return;
	}
	if ( ! sp.tiles || ! sp.tileSize) {
		console.warn("Sprite.js - need tileSize and/or tiles to initFrames", sp);		
		return;
	}
	assert(sp.tiles.length === 2, "Sprite.js tiles not [num-rows, num-cols]", sp);
	sp.frames = [];		
	let mx = (sp.tileMargin && sp.tileMargin.right) || 0;
	let my = (sp.tileMargin && sp.tileMargin.top) || 0;
	for(let r=0; r<sp.tiles[0]; r++) {
		for(let c=0; c<sp.tiles[1]; c++) {
			let fx = c*sp.tileSize[0] + c*mx;
			let fy = r*sp.tileSize[1] + r*my + my;
			let frame = [fx, fy];
			sp.frames.push(frame);
		}
	}
	// also set width & height
	if ( ! sp.width) sp.width = sp.tileSize[0];
	if ( ! sp.height) sp.height = sp.tileSize[1];
};

// paranoia - should be set on new
Sprite.width = s => s.width || (s.tileSize && s.tileSize[0]) || 48;
Sprite.height = s => s.height || (s.tileSize && s.tileSize[1]) || 48;

/**
 * @param sprite {!Sprite}
 * @param cmd {!Command}
 */
Sprite.addCommand = (sprite, cmd) => {
	if ( ! sprite.commands) sprite.commands = [];
	sprite.commands.push(cmd);
};

/**
 * TODO move into Grid
 * @param {Sprite} sp
 */
Sprite.screenRect = (sp) => {
	Sprite.assIsa(sp);
	const grid = Grid.get();
	let sxy = Grid.screenFromGame(sp);
	// offset the sprite
	let x = sxy.x - sp.width*sp.offsetx;
	let y = sxy.y - sp.height*sp.offsety;
	let width = sp.width * grid.tileWidth;
	let height = sp.height * grid.tileHeight;
	return new Rect({x,y,width,height});
};

/**
 * (sprite1, srpite2, dx, dy) =>
 */
Sprite.onCollision = null;

Sprite.update = (sprite, game) => {
	const tick = StopWatch.tick(game.ticker);
	const dt = StopWatch.dt(game.ticker);
	// command?
	if (sprite.commands && sprite.commands[0]) {
		const cmd = sprite.commands[0];
		const typ = getClass(sprite);
		typ.doCommand(sprite, cmd);
		// remove if done
		if (cmd.done) {
			sprite.commands.splice(0,1);
		}
	}
	// animate 
	Sprite.updateAnimation(sprite, game);
	
	if (sprite.dx && dt) {
		sprite.oldX = sprite.x; // NB: record old x,y so we can step-back onCollision
		sprite.x += sprite.dx * dt;
	}
	if (sprite.dy && dt) {
		sprite.oldY = sprite.y;
		sprite.y += sprite.dy * dt;
	}
	// off-stage?
	let stage = game.stage;
	// TODO get stage rect, test for collision, call onExit if no collision
	// Game.
}; // ./update()

/**
 * @param {!Sprite} sprite
 */
Sprite.updateAnimation = (sprite, game) => {
	if ( ! sprite.animate) return;
	const tick = StopWatch.tick(game.ticker);
	// animation tick
	if ( ! sprite.animate.startTick) sprite.animate.startTick = tick;
	const atick = tick - sprite.animate.startTick;
	const dt = sprite.animate.dt || 200; // default to 5 frames a second
	const tocks = Math.floor(atick / dt);
	// once only? (unusual but eg explosions)
	if (sprite.animate.stop && tocks >= sprite.animate.frames.length) {
		// ?? how to trigger the next thing? sprite.animate.onDone??
	} else {
		const i = tocks % sprite.animate.frames.length;
		sprite.frameIndex = sprite.animate.frames[i];
	}
};

/**
 * Set the current animation
 * @param {Sprite} sp
 * @param {String} a e.g. "left". "stop" for well, stop
 */
Sprite.animate = (sp, a) => {
	if (a==='stop') {
		if (sp.animate) sp.animate.stop = true;
		return;	
	}
	if (sp.animate && sp.animate.name === a) return;
	if ( ! sp.animations || ! sp.animations[a]) {
		console.warn("animate() - No animation "+a, sp);
		return;
	}

	sp.animate = Object.assign({name:a}, sp.animations[a]); // safety copy
	sp.frame = 0;
	// console.log("set animation", a, sp, sp.animations[a]);
};

/**
 * adjust sprite theta, dx, dy to point towards target
 * @param {!Sprite} sprite
 * @param {!Sprite} target
 */
Sprite.turnTowards = (sprite, target) => {
	let x = target.x - sprite.x;
	let y = target.y - sprite.y;	
	
	sprite.theta = Math.atan2(y,x);
	sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 10);
	sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 10);
	return [sprite.dx, sprite.dy];
};


/**
 * @param {!Sprite} sprite
 */
Sprite.setPixiProps = sprite => {
	Sprite.assIsa(sprite);
	const psprite = sprite.pixi;
	if ( ! psprite) {
		console.warn("No pixi for "+sprite.width, sprite);
		return;
	}
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
	const app = Game.get().app;
	let pres = app.loader.resources[sprite.src];
	assert(pres, "Not loaded Pixi resource "+sprite.src);
	let texture = new PIXI.Texture(pres.texture, tframe);
	psprite.texture = texture; //let psprite = new PIXI.Sprite(texture);
	// scale
	psprite.width = Sprite.width(sprite);
	psprite.height = Sprite.height(sprite);
};
