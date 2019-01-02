
import DataStore from './base/plumbing/DataStore';
import {getDataClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Sprite from './data/Sprite';

const Game = {};


Game.testCollision = (a, b) => {
	if (a===b) return false;
	// FIXME 
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	const w = 64; const h=64;
	return x+w > a.x && y+h > a.y 
		&& x+w > b.x && y+h > b.y;
};


Game.update = () => {
	// tick
	const lastTick = Game.tick;
	Game.tick = Math.floor(new Date().getTime() / 50);
	if (lastTick===Game.tick) return;
	// update stage and sprites
	const stage = DataStore.getValue(['data','Stage','main']);	
	if ( ! stage) return;
	Stage.assIsa(stage);
	let typ = getDataClass(stage);
	typ.update(stage, Game.tick);
	stage.sprites.forEach(s => getDataClass(s).update(s, Game.tick));

	DataStore.update();
};

Game.init = () => {
	if (Game.initFlag) return;
	Game.initFlag = true;
	// update loop
	let updater = setInterval(() => { Game.update(); }, 20); // target 1 tick
};

export default Game;
