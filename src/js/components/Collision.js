
import Rect from '../data/Rect';
// see http://jeffreythompson.org/collision-detection/table_of_contents.php

const collision = (sprite1, sprite2) => {
	return rectRect(sprite1, sprite2);
	// // x
	// let lowx = Math.round(Math.max(sprite1.x, sprite2.x));
	// let highx = Math.round(Math.min(sprite1.x+sprite1.width, sprite2.x+sprite2.width));
	// // y
	// let lowy = Math.round(Math.max(sprite1.y, sprite2.y));
	// let highy = Math.round(Math.min(sprite1.y+sprite1.height, sprite2.y+sprite2.height));
	// // no intersection?
	// if (lowx>highx || lowy>highy) return false;
	// // TODO fine-grained testing by polygons??	
	// return true;
};

/** are the sides of one rectangle touching the other?  */
const rectRect = (r1, r2) => 
	(
		r1.x + (r1.width || 1) >= r2.x &&	// r1 right edge past r2 left
		r1.x <= r2.x + (r2.width || 1) &&		// r1 left edge past r2 right
		r1.y + (r1.height || 1) >= r2.y &&		// r1 top edge past r2 bottom
		r1.y <= r2.y + (r2.height || 1)
	);

// TODO Polygons! https://github.com/gameofbombs/pixi-heaven

export {
	collision
};
