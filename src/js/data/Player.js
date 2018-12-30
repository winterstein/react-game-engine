
import {isa, defineType, getType} from '../base/data/DataClass';
import Sprite from './Sprite';

const Player = defineType('Player', Sprite);
const This = Player;
export default Player;

