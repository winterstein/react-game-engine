import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

const Creature = new KindOfCreature('Allosaurus');

Creature.kingdom = 'animal';

Creature.sprites = [SpriteLib.allosaurus()];

Creature.speed = 20;
Creature.attack = 25;

Creature.terrains = ['Grass','Earth','Water','Tree'];

Creature.chases = ['Meat','Werewolf','Fish'];

Creature.flees = ['Allosaurus','Frog'];

Creature.updater = 	({sprite, game, dt}) => {
	// big dinosaurs knock over trees!
	const {row,column} = Game.getRowColumn(game, sprite);
	const tile = Game.getTile({game, row, column});
	if (tile && tile.kind==='Tree') {
		KindOfCreature.doBite(sprite, tile);
	}
	// basic behaviour
	KindOfCreature.updater({kind:Creature, sprite, game, dt});
};


export default Creature;
