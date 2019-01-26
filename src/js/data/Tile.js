
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';
/**
 * A Tile is a Sprite without movement
 */
class Tile extends Sprite {}
const This = Tile;
export default Tile;

Tile.make = (base) => {
	let sp = Object.assign({}, base);	
	return sp;
};
