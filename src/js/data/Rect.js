
import DataClass, {getType, nonce} from '../base/data/DataClass';

class Rect extends DataClass {
	x;
	y;
	z=0;
	width;
	height;
	depth=0;
	constructor(base) {
		super(base);
	}
}
DataClass.register(Rect, 'Rect');

/**
 * duck type
 */
Rect.isa = r => {
	if ( ! r) return false;
	if (getType(r)==='Rect') return true;
	return r.x !== undefined && r.y !== undefined && r.width !== undefined && r.height !== undefined;
};

const This = Rect;
const Super = Object.assign({}, This);
export default Rect;
