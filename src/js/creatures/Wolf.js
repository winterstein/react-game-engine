import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Creature = new KindOfCreature('Wolf');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.wolf()];

Creature.speed = 50;

Creature.attack = 20;

Creature.terrains = ['Grass','Earth'];

Creature.flees = [];

Creature.chases = ['Meat', 'Sheep', 'Chicken'];

export default Creature;
