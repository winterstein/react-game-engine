
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Monster extends Sprite {}
DataClass.register(Monster,'Monster');

const This = Monster;
const Super = Sprite;
export default Monster;

Monster.update = (sprite, game) => {
	// TODO adjust dx, dy
	Super.update(sprite, game);	
};
