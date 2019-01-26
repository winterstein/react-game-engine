
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Monster extends Sprite {}

const This = Monster;
const Super = Sprite;
export default Monster;

Monster.update = (sprite, game) => {
	// TODO adjust
	// sprite.dx = 1; 
	// sprite.dy = 1;
	Super.update(sprite, game);	
};
