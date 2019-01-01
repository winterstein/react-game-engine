
import {isa, defineType, getType, nonce} from '../base/data/DataClass';

const Sprite = defineType('Sprite');
const This = Sprite;
export default Sprite;

Sprite.make = (base) => {
	let sp = Object.assign({src:'/img/dummy-sprite.png', width:100, height:100, frame:0}, base);
	if ( ! sp.id) sp.id = nonce();
	return sp;
};
