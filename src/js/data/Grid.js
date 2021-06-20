

import DataClass, {getType} from '../base/data/DataClass';
import Rect from './Rect';

class InGameTiles extends Number {}

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

class Grid extends DataClass {
	/** Set x,y = 0 to implement Rect */
	x=0;

	y=0;

	/**
	 * @type {InGameTiles} the in-game width in tiles
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

	/**
	 * @type {Number} screen pixels
	 */
	screenWidth;

	/**
	 * @type {Number} screen pixels
	 */
	screenHeight;

	/**
	 * @type {Rect}
	 */
	screen;

	/**
	 * @type {Number} HACK: scaling factor applied to shrink graphics / grow the screen on mobile.
	 * The true device screen width is screenWidth*screenScale.
	 */
	screenScale = 1;

	/**
	 * @type {Number} screen pixels, 1% of width
	 */
	vw;
	/**
	 * @type {Number} screen pixels, 1% of height
	 */
	vh;
	
	/**
	 * screen pixels
	 */
	tileWidth = 48;

	/**
	 * screen pixels
	 */
	tileHeight = 48;

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
/**
 * @param {Grid} grid
 * @returns {Rect}
 */
Grid.screen = grid => {
	if ( ! grid.screen) {
		grid.screen = new Rect({x:0,y:0,width:grid.screenWidth,height:grid.screenHeight});
	}
	return grid.screen;
};

const RT2 = Math.sqrt(2);

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
	assert(x !== undefined && y !== undefined, "Grid.js screenFromGame gxy NPE", gxy);

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

	// isometric
	assert(x !== undefined && y !== undefined, "Grid.js screenFromGame", gxy);
	return {
		x: (x*tw + y*th)*RT2, 
		y: (y*th - x*tw)*RT2 - z + 300 // TODO + max x*tw*RT2 so that {max, 0} maps to sy=0
	};	
};

