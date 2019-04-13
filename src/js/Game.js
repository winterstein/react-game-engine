
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
	// off screen?
	const grid = stage.grid;
	stage.sprites.forEach(sp => {
		if (sp.hidden) return;		
		if (Rect.intersects(sp, grid)) return;
		// rightwards or up/down?
		const dy = sp.y+sp.height < 0? -1 : sp.y > grid.height? 1 : 0;
		const dx = sp.x+sp.width < 0? -1 : sp.x > grid.width? 1 : 0;		
		console.log("OFF", dx, dy, "x y", sp.x, sp.y, "vs", grid.width, grid.height, "with", sp.width, sp.height);
		Rect.intersects(sp, grid);
		getClass(sp).onOffScreen(sp, {dx, dy});
	});

	// focus on front player
	const xs = game.players.map(p => p.x);
	let mx = Math.max(...xs);
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

Game.getStage = (game) => {
	return (game || Game.get()).stage;
};
Game.setStage = (game, stage) => {
	game.stage = stage;
};

/**
 * @param game {!Game}
 * @param players {!Player[]}
 */
Game.setPlayers = (game, players) => {
	game.players = players;
	_.defer(() => DataStore.update());
};

window.Game = Game; //debug
export default Game;
