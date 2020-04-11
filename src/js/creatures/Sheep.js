import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const sheep = new KindOfCreature('Sheep');

sheep.kingdom = 'animal';

sheep.sprites = [SpriteLib.sheep(),SpriteLib.sheep(1),SpriteLib.sheep(2),SpriteLib.sheep(3)];

sheep.speed = 20;

sheep.terrains = ['Grass','Earth'];

// sheep flock together
sheep.chases = ['Sheep'];

// Sheep are dumb
sheep.flees = ['Goose'];

/**
 * Add wander behaviour
 */
sheep.updater = ({sprite,game,dt}) => {
	if (sprite.wanderSeconds > 0) {
		sprite.wanderSeconds -= dt;		
		return; // keep wandering
	}
	// wander sometimes (ahead of flock)
	if (Math.random() >	0.95) {
		// pick a direction	
		sprite.theta = Math.random()*Math.PI*2;		
		sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 1);
		sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 1);
		// wander for a bit
		sprite.wanderSeconds = 2;
		return;
	}
	// basic behaviour, ie flock
	KindOfCreature.updater({kind:sheep, sprite,game,dt});
};

export default sheep;
