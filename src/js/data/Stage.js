
import DataClass, {getType} from '../base/data/DataClass';

class Stage extends DataClass {
	sprites = [];
	width = 1000;
	height = 1000;
}
DataClass.register(Stage,'Stage');
export default Stage;

Stage.addSprite = (stage, sprite) => {
	stage.sprites.push(sprite);
};

Stage.update = (stage, game) => {
	// no-op
};
