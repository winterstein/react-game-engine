
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

const This = Rect;
const Super = Object.assign({}, This);
export default Rect;
