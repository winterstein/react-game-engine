import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Badger = new KindOfCreature('Badger');

Badger.kingdom = 'animal';

Badger.sprites = [SpriteLib.badger()];

Badger.speed = 199;

Badger.terrains = ['Grass','Earth','Water'];

Badger.chases = ['Werewolf','Frog','Sheep','Goat','Meat','Chicken','Grass'];

export default Badger;
