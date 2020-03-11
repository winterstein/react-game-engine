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
	 * String to Sprite
	 */
	sprites = {};

	/** @type {StopWatch}  */
	ticker = new StopWatch();

	/**
	 * @type {PIXI.Application}
	 */
	app;

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

window.Game = Game; //debug
export default Game;
