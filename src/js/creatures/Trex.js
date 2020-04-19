import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Trex');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.trex()];

Creature.speed = 20;

Creature.terrains = ['Grass','Earth'];

Creature.chases = ['Meat','Werewolf'];

export default Creature;
