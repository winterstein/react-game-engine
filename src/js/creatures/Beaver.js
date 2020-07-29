import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Beaver');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.beaver()];

Creature.speed = 15;
Creature.attack = 5;

Creature.terrains = ['Grass','Earth','Water', 'Tree'];

Creature.chases = ['Wood', 'Tree','Frog'];

Creature.flees = ['BlueShark'];

export default Creature;
