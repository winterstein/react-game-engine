
import {isa, defineType, getType} from '../base/data/DataClass';

const Sprite = defineType('Sprite');
const This = Sprite;
export default Sprite;

Sprite.make = (base) => {
	let sp = Object.assign({}, base);
	// dummy image
	sp.src = ;
	sp.clips = [[0,0]];
	sp.img = 0;
	
	return sp;
};
