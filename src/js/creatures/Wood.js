import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Wood = new KindOfCreature('Wood');

Wood.kingdom = 'mineral';

Wood.sprites = [SpriteLib.icon('Wood')];

Wood.speed = 0;
Wood.carry = true;

export default Wood;
