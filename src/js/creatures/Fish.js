import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Fish = new KindOfCreature('Fish');

Fish.sprites = [SpriteLib.fish(), SpriteLib.fish(1)];

Fish.speed = 20;

Fish.terrains = ['Water'];

export default Fish;
