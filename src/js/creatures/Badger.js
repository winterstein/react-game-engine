import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Badger = new KindOfCreature('Badger');

Badger.sprites = [SpriteLib.badger()];

Badger.speed = 20;

Badger.terrains = ['Grass','Earth','Water'];

Badger.chases = ['Werewolf'];

export default Badger;
