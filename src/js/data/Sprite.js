
import DataClass, {getType, nonce} from '../base/data/DataClass';

import Rect from './Rect';
import Grid from './Grid';

/** 
 * @typedef {Object} Animate
 * @prop {Number[]} frames - indexes into Sprite.frames 
 * @prop {Number} dt
*/

/**
 * src: {url}
 * x: game-x
 * y: game-y (NOT height)
 * frames: [[x,y]]
 * tiles: ?[rows, columns] in the image
 */
class Sprite extends DataClass {
	/**
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
	offsetx = 0;
	offsety = 0;
	/**
	 * screen pixel width
	 */
	width;
	/**
	 * screen pixel height
	 */
	height;
	frame = 0;
	frames;
	/**
	 * 
	 */
	tiles;
	/**
	 * @type {Number[]}
	 */
	tileSize;
	tileMargin;
	
	animations = {};
	/**
	 * @type {Animate}
	 */
	animate;

	constructor(base) {
		super(base);
		const sp = this;
		Object.assign(this, {
			src:'/img/dummy-sprite.png', 
			width:100, height:100, 
		}, base);
		if ( ! sp.id) sp.id = nonce();
		// split into tiles?
		if (sp.tileSize && sp.tiles && ! sp.frames) {
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
		}
	} // ./ constructor
}
DataClass.register(Sprite,'Sprite');

export default Sprite;

/**
 * @param {Sprite} sp
 */
Sprite.screenRect = (sp) => {
	Sprite.assIsa(sp);
	let sxy = Grid.screenFromGame(sp);
	// offset the sprite
	let x = sxy.x - sp.width*sp.offsetx;
	let y = sxy.y - sp.height*sp.offsety;
	let width = sp.width;
	let height = sp.height;
	return new Rect({x,y,width,height});
};

Sprite.update = (sprite, game) => {
	const tick = game.tick;
	const dt = game.dt;
	// animate 
	if (sprite.animate) {
		let tocks = Math.floor(tick / sprite.animate.dt);
		const i = tocks % sprite.animate.frames.length;
		sprite.frame = sprite.animate.frames[i];
	}
	if (sprite.dx && dt) {
		sprite.x += sprite.dx * dt;
	}
	if (sprite.dy && dt) {
		sprite.y += sprite.dy * dt;
	}
	// off-stage?
	let stage = game.stage;
	// TODO get stage rect, test for collision, call onExit if no collision
	// Game.
};
