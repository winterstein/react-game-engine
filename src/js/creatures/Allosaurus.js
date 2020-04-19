import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Allosaurus');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.allosaurus()];

Creature.speed = 20;
Creature.attack = 25;

Creature.terrains = ['Grass','Earth','Water'];

Creature.chases = ['Meat','Werewolf','Tree'];

export default Creature;
