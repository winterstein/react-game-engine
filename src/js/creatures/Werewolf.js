import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Werewolf');

Creature.sprites = [SpriteLib.werewolf(), SpriteLib.werewolf(1)];

Creature.speed = 15;

Creature.terrains = ['Grass','Earth'];

export default Creature;
