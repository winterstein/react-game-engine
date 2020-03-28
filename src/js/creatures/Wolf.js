import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Wolf = new KindOfCreature('Wolf');

Wolf.sprites = [SpriteLib.wolf()];

Wolf.speed = 50;

Wolf.terrains = ['Grass','Earth'];

Wolf.chases = ['Sheep', 'Chicken'];

export default Wolf;
