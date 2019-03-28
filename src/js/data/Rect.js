
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
	const yes = r.x !== undefined && r.y !== undefined && r.width !== undefined && r.height !== undefined;
	return yes;
};

/**
 * a {Rect} x, y, width, height
 * b {Rect}
 * @returns true if a overlaps b (though false if a===b)
 */
Rect.intersects = (a, b) => {
	if (a===b) return false;
	Rect.assIsa(a);
	Rect.assIsa(b);
	// ref https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
	return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
};

const This = Rect;
const Super = Object.assign({}, This);
export default Rect;
