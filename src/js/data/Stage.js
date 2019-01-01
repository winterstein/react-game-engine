
import {isa, defineType, getType} from '../base/data/DataClass';

const Stage = defineType('Stage');
const This = Stage;
export default Stage;

Stage.make = (base) => {
	let sp = Object.assign({sprites:[]}, base);
	return sp;
};

Stage.addSprite = (stage, sprite) => {
	stage.sprites.push(sprite);
};
