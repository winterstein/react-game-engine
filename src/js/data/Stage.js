
import DataClass, {getType} from '../base/data/DataClass';
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
