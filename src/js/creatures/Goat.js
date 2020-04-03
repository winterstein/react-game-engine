import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Goat = new KindOfCreature('Goat');

Goat.kingdom = 'animal';

Goat.sprites = [SpriteLib.goat(), SpriteLib.goat(1)];

Goat.speed = 25;

Goat.terrains = ['Grass','Earth'];

Goat.flees = ['Wolf','Goose'];

export default Goat;
