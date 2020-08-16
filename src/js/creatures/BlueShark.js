import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('BlueShark');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.BlueShark()];

Creature.speed = 30;
Creature.attack = 20;

Creature.terrains = ['Water'];

Creature.chases = ['Meat','Fish','Frog','Beaver'];

Creature.flees = ['Allosaurus'];

Creature.updater = 	({sprite, game, dt}) => {
	// basic behaviour
	KindOfCreature.updater({kind:Creature, sprite, game, dt});
};


export default Creature;
