
import {isa, defineType, getType, nonce} from '../base/data/DataClass';

const Sprite = defineType('Sprite');
const This = Sprite;
const Super = Object.assign({}, This);
export default Sprite;

Sprite.make = (base) => {
	base = Super.make(base);
	let sp = Object.assign({src:'/img/dummy-sprite.png', width:100, height:100, frame:0}, base);
	if ( ! sp.id) sp.id = nonce();
	return sp;
};

Sprite.update = (sprite, tick) => {
	// animate 
	if (sprite.animate) {
		let tocks = Math.floor(tick / sprite.animate.dt);
		const i = tocks % sprite.animate.frames.length;
		sprite.frame = sprite.animate.frames[i];
	}
	if (sprite.dx) sprite.x += sprite.dx;
	if (sprite.dy) sprite.y += sprite.dy;
};
