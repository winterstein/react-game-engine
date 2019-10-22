
import DataClass, {getClass, getType, nonce} from '../base/data/DataClass';

import Rect from './Rect';
import Grid from './Grid';
import StopWatch from '../StopWatch';

class Animate extends DataClass {
	
	/** @type {Number[]} indexes into Sprite.frames */
	frames;

	/** @type {Number} */
	dt;   
}
DataClass.register(Animate, 'Animate');


/** 
 * @typedef {Number[]} IntXY
*/


/**
 * id: always a fresh nonce
 * src: {url}
 * x: game-x
 * y: game-y (NOT height)
 * frames: [[x,y]]
 * tiles: ?[rows, columns] in the image
 */
class Sprite extends DataClass {
	/**
	 * index into frames for the current frame
	 */
	frame = 0;
	
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
	x;
	/**
	 * @type {Number} game tile y
	 */
	y;

	/**
	 * @type {Number} game tile z -- NOT usually used TODO
	 */
	z;

	offsetx = 0;
	offsety = 0;
	/**
	 * tile width
	 */
	width = 1;
	/**
	 * tile height
	 */
	height = 1;

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
	 * @type {Boolean}
	 */
	hidden = false;

	/**
	 * ALWAYS assigns a new id, to allow for copy constructors
	 * @param base {Sprite}
	 * 
	 * e.g.
	 * new Sprite({
	 * 	tileSize: [width px, height px]
	 *  tiles: [index]
	 * })
	 */
	constructor(base, base2) {
		super(base);
		const _type = this['@type'];
		const sp = this;
		Object.assign(this, {
			src:'/img/dummy-sprite.png' 
		}, base, base2);
		// in case the base overwrites this
		this['@type'] = _type;
		// ALWAYS assigns a new id, to allow for copy constructors, e.g. ufo2 = new Sprite(ufo)
		sp.id = nonce();
		// split into tiles?
		Sprite.initFrames(this);
	} // ./ constructor
}
DataClass.register(Sprite,'Sprite');

export default Sprite;

/**
 * Setup frames for animation -- requires tileSize and tiles
 * @param {Sprite} sp
 */
Sprite.initFrames = sp => {
	if (sp.frames) {
		return; // all done
	}
	if ( ! sp.tileSize && ! sp.tiles) {
		console.warn("Sprite.js - need tileSize and/or tiles to initFrames", sp);
		return;
	}
	if ( ! sp.tiles || ! sp.tileSize) {
		if ( ! sp.src) {
			console.log("Sprite.js - no url = no frames", sp);
			return;
		}
		sp.loading = true;
		let _img = new Image();
		_img.onload = () => {
			sp.loading = false;
			if ( ! sp.tiles) sp.tiles = [Math.round(_img.naturalHeight / sp.tileSize[1]), Math.round(_img.naturalWidth / sp.tileSize[0])];
			if ( ! sp.tileSize) {
				sp.tileSize = [
					Math.round(_img.naturalWidth / sp.tiles[1]),
					Math.round(_img.naturalHeight / sp.tiles[0])
				];
			}
			Sprite.initFrames(sp);
		};
		_img.src = sp.src;
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
};

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
	if (sprite.animate) {
		Sprite.updateAnimation(sprite, game);
	}
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

Sprite.updateAnimation = (sprite, game) => {
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
		sprite.frame = sprite.animate.frames[i];
	}
};

/**
 * Set the current animation
 * @param {Sprite} sp
 * @param {String} a
 */
Sprite.animate = (sp, a) => {
	if (sp.animate && sp.animate.name === a) return;
	sp.animate = Object.assign({name:a}, sp.animations[a]); // safety copy
	sp.frame = 0;
	console.log("set animation", a, sp, sp.animations[a]);
};

/**
 * Usually replaced by Player.doCommand etc
 */
Sprite.doCommand = (sprite, cmd) => {
	console.warn(cmd, sprite);
	cmd.done = true;
};

Sprite.onOffScreen = sp => {
	// sp.hidden = true;
};

/**
 * @type {String: Sprite}
 */
Sprite.library = {};
