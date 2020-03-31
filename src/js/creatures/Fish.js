import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Fish = new KindOfCreature('Fish');

Fish.kingdom = 'animal';

Fish.sprites = [SpriteLib.fish(), SpriteLib.fish(1)];

Fish.speed = 10;

Fish.attack=1;

Fish.terrains = ['Water'];

export default Fish;

Fish.chases =['Frog','Meat','Goose'];
