
import DataClass, {getType, getClass} from '../base/data/DataClass';
import Grid from './Grid';
import {collision} from '../components/Collision';

class Stage extends DataClass {
	sprites = [];
	/**
	 * {String: Boolean}
	 */
	flag = {};
	width = 1000;
	height = 1000;
	/**
	 * @type {!Grid}
	 */
	grid = Grid.get();

	constructor(base) {
		super(base);
		Object.assign(this, base);
	}
}
DataClass.register(Stage,'Stage');
export default Stage;

Stage.addSprite = (stage, sprite) => {
	if (stage.sprites.filter(sp => sp.id===sprite.id).length) {
		console.warn("Stage.js - Skip double add of sprite", sprite);
		return;
	}
	stage.sprites.push(sprite);
};

Stage.setGrid = (stage, grid) => {
	Stage.assIsa(stage);
	Grid.assIsa(grid);
	stage.grid = grid;
};

Stage.update = (stage, game) => {
	// no-op
};

/**
 * No-op - replace to do something
 */
Stage.testCollisions = stage => {};

Stage.testCollisionsBetween = (sprites1, sprites2) => {
	sprites1.forEach(s1 => {
		sprites2.forEach(s2 => {
			if ( ! Rect.intersects(s1, s2)) return;
			const t1 = getClass(s1);
			const t2 = getClass(s2);	
			let col = collision(s1,s2);
			if ( ! col) return;
			// call onCollision functions
			if (t1.onCollision) {
				let {dx, dy} = Stage.testCollisionDirn(s1, s2);
				t1.onCollision(s1, s2, dx, dy);
			}
			if (t2.onCollision) {
				let {dx, dy} = Stage.testCollisionDirn(s2, s1);
				t2.onCollision(s2, s1, dx, dy);
			}
		});
	});
};

/**
 * @param sprite1 {Sprite}
 * @param sprite2 {Sprite}
 * @returns {dx, dy} TODO The step-back from the POV of sprite1
 */
Stage.testCollisionDirn = (sprite1, sprite2) => {
	let dx, dy;
	// would oldX be clear?
	if (sprite1.dx) {
		let oldr1 = new Rect(sprite1);
		oldr1.x = sprite1.oldX; 
 		if ( ! Rect.intersects(oldr1, sprite2)) {
			dx = sprite1.oldX - sprite1.x;
		}
	}
	if (sprite1.dy) {
		let oldr1y = new Rect(sprite1);
		oldr1y.y = sprite1.oldY; 
 		if ( ! Rect.intersects(oldr1y, sprite2)) {
			dy = sprite1.oldY - sprite1.y;
		}
	}
	if ( ! dx && ! dy) {
		// => both needed, or it was sprite2's fault
		dx = sprite1.oldX - sprite1.x;
		dy = sprite1.oldY - sprite1.y;
	}
	// NB: This is probably a bigger step back than is needed!
	return {dx, dy};
};

Stage.testCollisions = stage => {
	const players = stage.sprites.filter(sp => Player.isa(sp));
	const tiles = stage.sprites.filter(sp => Tile.isa(sp));
	Stage.testCollisionsBetween(players, tiles);
	const monsters = stage.sprites.filter(sp => Monster.isa(sp));
	Stage.testCollisionsBetween(players, monsters);
};

/**
 * on start: go forward and down
 */
Stage.start = function(stage, game) {
	if (stage.flag && stage.flag.start) return;
	console.warn("Sstage start", stage);
	game.players.forEach(p => {
		p.dx = 2;
		p.dy = 2;
	});
	if ( ! stage.flag) stage.flag = {};
	stage.flag.start = true;
};
