
import DataStore from './base/plumbing/DataStore';
import DataClass, {getClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Sprite from './data/Sprite';
import Rect from './data/Rect';

import {assert} from 'sjtest';

class Game extends DataClass {
	/**
	 * String to Sprite
	 */
	sprites = {
		loading: new Sprite()
	};
	/**
	 * @typedef {Player[]}
	 */
	players = [];
	/** {TimeNumber} */
	tick;
	/** {Number} */
	dt;
	/** {Stage} */
	stage;

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

/**
 * a {Rect} x, y, width, height
 * b {Rect}
 */
Game.testCollision = (a, b) => {
	if (a===b) return false;
	Rect.assIsa(a);
	Rect.assIsa(b);
	// ref https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
	return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
};

const tickLength = 1000 / 20;

Game.update = () => {
	// tick
	const game = Game.get();
	const lastTick = game.tick;
	let newTick = new Date().getTime(); // TODO pause logic
	if (newTick - lastTick < tickLength) {
		return; // target 20 fps
	}
	game.tick = newTick;
	// in seconds
	game.dt = (newTick - lastTick) / 1000;
	// update stage and sprites
	const stage = Game.getStage();
	if ( ! stage) return;
	Stage.assIsa(stage);
	let typ = getClass(stage);
	typ.update(stage, game);
	stage.sprites.forEach(s => {
		const dc = getClass(s);
		assert(dc, "Game.js - no class - use DataClass.register with the class definition", s)
		dc.update(s, game);
	});

	DataStore.update();
};

Game.init = () => {
	if (Game.initFlag) return;
	Game.initFlag = true;
	// update loop
	let updater = setInterval(() => { Game.update(); }, tickLength/4); // target 1 tick
	// game object, if not already made
	const game = Game.get();
	// tick
	game.tick = new Date().getTime();
};

Game.getStage = () => {
	return Game.get().stage;
};
/**
 * @param game {!Game}
 * @param players {!Player[]}
 */
Game.setPlayers = (game, players) => {
	game.players = players;
};

window.Game = Game; //debug
export default Game;
