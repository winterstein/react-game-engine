import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Meat = new KindOfCreature('Meat');

Meat.kingdom = 'mineral';

Meat.sprites = [SpriteLib.icon('Meat')];

Meat.speed = 0;
Meat.carry = true;

export default Meat;
