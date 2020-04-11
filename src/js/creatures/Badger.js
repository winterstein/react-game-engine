import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Badger = new KindOfCreature('Badger');

Badger.kingdom = 'animal';

Badger.sprites = [SpriteLib.badger(),SpriteLib.badger(1)];

Badger.speed = 140;

Badger.terrains = ['Grass','Earth','Water','Tree'];

Badger.chases = ['Werewolf','Frog','Sheep','Goat','Meat','Chicken','Wolf','Fish'];

export default Badger;
