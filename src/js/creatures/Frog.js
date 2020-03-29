import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Frog');

Creature.sprites = [SpriteLib.frog()];

Creature.speed = 15;

// frog can go anywhere
// Creature.terrains = ['Grass','Earth'];

export default Creature;
