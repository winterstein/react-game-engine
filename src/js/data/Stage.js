
import DataClass, {getType, getClass} from '../base/data/DataClass';
import Grid from './Grid';

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
			if (t1.onCollision) t1.onCollision(s1, s2);
			if (t2.onCollision) t2.onCollision(s2, s1);
		});
	});
};
