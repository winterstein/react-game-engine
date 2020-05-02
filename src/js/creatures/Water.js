import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Water = new KindOfCreature('Water');

Water.bg = true;
 
Water.kingdom = 'mineral';

Water.sprites = [SpriteLib.tile('Water')];

Water.speed = 0;

export default Water;
