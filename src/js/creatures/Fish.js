import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Fish = new KindOfCreature('Fish');

Fish.kingdom = 'animal';

Fish.sprites = [SpriteLib.fish(), SpriteLib.fish(1)];

Fish.speed = 10;

Fish.attack=1;

Fish.terrains = ['Water'];

export default Fish;

Fish.chases =['Frog','Meat'];

Fish.updater = ({sprite,game,dt}) => {
	// Fish on land die :(
	const {row,column} = Game.getRowColumn(game, sprite);
	const tile = Game.getTile({game, row, column});
	if (tile && tile.kind !== 'Water') {
		KindOfCreature.doBite({attack:1}, sprite);
	}

	// basic behaviour, ie flock
	KindOfCreature.updater({kind:Fish, sprite,game,dt});
};
