
import {isa, defineType, getType, nonce} from '../base/data/DataClass';

const Rect = defineType('Rect');
const This = Rect;
const Super = Object.assign({}, This);
export default Rect;

Rect.make = ({x,y,z=0,width,height,depth=0}) => {
	return {x,y,z,width,height,depth};
};
