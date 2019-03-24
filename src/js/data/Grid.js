

import DataClass, {getType} from '../base/data/DataClass';
import Rect from './Rect';

class Grid extends DataClass {
	/**
	 * @type {Number} the in-game width in tiles
	 */
	width;
	/**
	 * @type {Number} the in-game height in tiles
	 */
	height;

	/**
	 * @type {String} iso|2d
	 */
	display;

	/**
	 * If set, then shift so that this is the center
	 * @type {GXY}
	 */
	focus;

	screenWidth;
	screenHeight;
	
	/**
	 * screen pixels
	 */
	tileWidth = 50;
	/**
	 * screen pixels
	 */
	tileHeight = 50;

	constructor(base) {
		super(base);
		Object.assign(this, base);
	}
}
DataClass.register(Grid, 'Grid');
const This = Grid;
export default Grid;

const defaultGrid = new Grid();
/**
 * Default grid object
 * @returns {!Grid}
 */
Grid.get = () => defaultGrid;

const RT2 = Math.sqrt(2);


/** 
 * @typedef {Object} SXY
 * Screen x-y measure in pixels
 * @prop {Number} x
 * @prop {Number} y
*/

/** 
 * @typedef {Object} GXY 
 * Game x-y, measured in tiles. E.g. 0-10. Fractions are used.
 * @prop {Number} x
 * @prop {Number} y
*/

/**
 * Isometric projection:
 * x: right-left
 * y: right-down
 * z: up (height)
 * 
 * Focus: grid.focus if set
 * 
 * @return {SXY}
 */
Grid.screenFromGame = gxy => {
	const grid = Grid.get();
	const tw = grid.tileWidth;
	const th = grid.tileHeight;
	let {x, y, z=0} = gxy;
	assert(x !== undefined && y !== undefined, "Grid.js screenFromGame", gxy);

	// where is the center?
	if (grid.focus) {
		if (grid.focus.x) {
			x = x - grid.focus.x + 5;
		}
		if (grid.focus.y) {
			x = y - grid.focus.y + 5; // TODO 5 = screenHeight/2*tileHeight	
		}
	}

	if (grid.display === '2d') {
		return {
			x: x*tw, 
			y: y*th
		};
	}


	assert(x !== undefined && y !== undefined, "Grid.js screenFromGame", gxy);
	return {
		x: (x*tw + y*th)*RT2, 
		y: (y*th - x*tw)*RT2 - z + 300 // TODO + max x*tw*RT2 so that {max, 0} maps to sy=0
	};	
};

