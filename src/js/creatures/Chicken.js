import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Chicken = new KindOfCreature('Chicken');

Chicken.kingdom = 'animal';

Chicken.sprites = [SpriteLib.chicken(), SpriteLib.chicken(1)];

Chicken.speed = 25;

Chicken.terrains = ['Grass','Earth'];

Chicken.flees = ['Wolf'];

export default Chicken;
