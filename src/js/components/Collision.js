
import Rect from '../data/Rect';

const collision = (sprite1, sprite2) => {
	// x
	let lowx = Math.round(Math.max(sprite1.x, sprite2.x));
	let highx = Math.round(Math.min(sprite1.x+sprite1.width, sprite2.x+sprite2.width));
	// y
	let lowy = Math.round(Math.max(sprite1.y, sprite2.y));
	let highy = Math.round(Math.min(sprite1.y+sprite1.height, sprite2.y+sprite2.height));
	// no intersection?
	if (lowx>highx || lowy>highy) return false;
	// TODO fine-grained testing by polygons??	
	return true;
};

export {
	collision
};
