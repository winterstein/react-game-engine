
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

	// collisions?
	Stage.testCollisions(stage);

	// focus on front player
	let mx = Math.max(game.players.map(p => p.x));
	const grid = Grid.get();
	grid.focus = {x:mx};

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
