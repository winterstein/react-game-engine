
import {isa, defineType, getType, nonce} from '../base/data/DataClass';

import Rect from './Rect';
import Grid from './Grid';

const Sprite = defineType('Sprite');
const This = Sprite;
const Super = Object.assign({}, This);
export default Sprite;

/**
 * x: game-x
 * y: game-y (NOT height)
 * 
 */
Sprite.make = (base) => {
	base = Super.make(base);
	let sp = Object.assign({src:'/img/dummy-sprite.png', 
		offsetx:0, offsety:0, width:100, height:100, frame:0}, base);
	if ( ! sp.id) sp.id = nonce();
	return sp;
};

// Sprite.gameRect = (sp) => {
// 	return Rect.make({sp.x, sp.y, sp.width, sp.height});
// };

Sprite.screenRect = (sp) => {
	let s = Grid.screenFromGame(sp.x, sp.y, sp.z);
	// offset the sprite
	let x = s[0] - sp.width*sp.offsetx;
	let y = s[1] - sp.height*sp.offsety;
	let width = sp.width;
	let height = sp.height;
	return Rect.make({x,y,width,height});
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
