import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

class Frog extends KindOfCreature {
	
}
const Creature = new KindOfCreature('Frog');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.frog()];

Creature.speed = 159;

// frog can go anywhere
Creature.terrains = ['Grass','Earth','Tree','Water'];

export default Creature;

Creature.flees = ['Badger','Fish'];
