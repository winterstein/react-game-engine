
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';
/**
 * A Tile is a Sprite without movement
 */
class Tile extends Sprite {

	constructor(base) {
		super(base);
		this['@type'] = 'Tile';	// allow for copying a Sprite base
	}

} // ./Tile
DataClass.register(Tile, 'Tile');
const This = Tile;
export default Tile;

// no-op
Tile.update = () => {};
