import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Tree = new KindOfCreature('Tree');

Tree.kingdom = 'vegetable';

Tree.sprites = [SpriteLib.tile('Tree')];

Tree.speed = 0;

export default Tree;
