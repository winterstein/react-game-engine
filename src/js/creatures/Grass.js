import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Grass = new KindOfCreature('Grass');
Grass.bg = true;
Grass.kingdom = 'vegetable';

Grass.sprites = [SpriteLib.tile('Grass')];

Grass.speed = 0;

export default Grass;
