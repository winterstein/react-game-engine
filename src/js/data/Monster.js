
import {isa, defineType, getType} from '../base/data/DataClass';
import Sprite from './Sprite';

const Monster = defineType('Monster', Sprite);
const This = Monster;
const Super = Sprite;
export default Monster;

Monster.update = (sprite, tick) => {
	// TODO adjust
	sprite.dx = 1; 
	sprite.dy=1;

	Super.update(sprite, tick);	
};
