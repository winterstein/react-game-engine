/**
 * Base class for Games
 */
import DataStore from './base/plumbing/DataStore';
import DataClass, {getClass} from './base/data/DataClass';
import Sprite from './data/Sprite';
import Rect from './data/Rect';
import StopWatch from './StopWatch';
import {assert} from 'sjtest';

class Game extends DataClass {
	/**
	 * {String: PIXI.Container} world | ui | ground | characters
	 */
	containerFor = {};
	/**
	 * String to Sprite
	 */
	sprites = {};

	/** @type {StopWatch}  */
	ticker = new StopWatch();

	/**
	 * @type {PIXI.Application}
	 */
	app;

	width;
	
	height;

	constructor(base) {
		super(base);
		Object.assign(this, base);
	}

	/**
	 * @return {Game} game object -- never null even pre-init. Will create if unset.
	 */
	static get() {
		return DataStore.getValue('data', 'Game') || DataStore.setValue(['data','Game'], new Game(), false);
	};

} // ./Game
DataClass.register(Game, 'Game');


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
Game.handleInput = ({sprite, input, on}) => {
	if ( ! sprite) {
		sprite = Game.get().sprites['player0'];
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
	}
	// console.log(input, on, sprite.dx + " dy: "+sprite.dy, sprite);
};

window.Game = Game; //debug
export default Game;
