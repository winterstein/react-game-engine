
import DataStore from './base/plumbing/DataStore';
import DataClass, {getDataClass} from './base/data/DataClass';
import Stage from './data/Stage';

class Game extends DataClass {
	sprites = [];
	tick;
	/** {Number} */
	dt;
	/** {Stage} */
	stage;

	constructor(base) {
		super(base);
	}
}

/**
 * a {Rect} x, y, width, height
 * b {Rect}
 */
Game.testCollision = (a, b) => {
	if (a===b) return false;
	// ref https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
	return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
};


Game.update = () => {
	// tick
	const game = Game.get();
	const lastTick = game.tick;
	let newTick = new Date().getTime(); // TODO pause logic
	if (newTick - lastTick < 50) {
		return; // target 20 fps
	}
	game.tick = newTick;
	// in seconds
	game.dt = (newTick - lastTick) / 1000;
	// update stage and sprites
	const stage = Game.getStage();
	if ( ! stage) return;
	Stage.assIsa(stage);
	let typ = getDataClass(stage);
	typ.update(stage, game);
	stage.sprites.forEach(s => getDataClass(s).update(s, game));

	DataStore.update();
};

Game.init = () => {
	if (Game.initFlag) return;
	Game.initFlag = true;
	// update loop
	let updater = setInterval(() => { Game.update(); }, 20); // target 1 tick
	// game object, if not already made
	const game = Game.get();
	// tick
	game.tick = new Date().getTime();
};

/**
 * @return game object -- never null even pre-init. Will create if unset.
 */
Game.get = () => {
	return DataStore.getValue('data', 'Game') || DataStore.setValue(['data','Game'], new Game(), false);
};

Game.getStage = () => {
	return Game.get().stage;
};

window.Game = Game; //debug
export default Game;
