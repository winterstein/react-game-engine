
import DataClass, {getType} from '../base/data/DataClass';

class Stage extends DataClass {}
const This = Stage;
export default Stage;

const Super = Object.assign({}, This);

Stage.make = (base) => {
	base = Super.make(base);
	let sp = Object.assign({sprites:[], width:1000, height:1000}, base);
	return sp;
};

Stage.addSprite = (stage, sprite) => {
	stage.sprites.push(sprite);
};

Stage.update = (stage, game) => {
	// no-op
};
