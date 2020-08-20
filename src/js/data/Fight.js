
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Fight extends DataClass {
	/** @type{Sprite[]} */
	team;
	/** @type{Sprite[]} */
	enemies;
}
DataClass.register(Fight,'Fight');
Fight.str = f => "Fight";

Fight.sprites = f => [...f.team,...f.enemies];

const This = Fight;
export default Fight;
