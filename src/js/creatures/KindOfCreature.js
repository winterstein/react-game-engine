import Game, { dist2 } from "../Game";
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';

class KindOfCreature {
	
	name;

	sprites;
	
	speed;

	terrains;	

	chases;

	flees;

	updater = KindOfCreature.updater;

	constructor(name) {
		this.name = name;
	}
}

/**
 * Basic updater
 */
KindOfCreature.updater = ({kind, game, sprite, dt}) => {
	// mostly no change
	if (Math.random() < 0.75) return;
	
	if (kind.flees) {
		let near = Game.getNearest({sprite, game, types:kind.flees, limit:3});		
		if (near) {
			Sprite.turnTowards(sprite, near);
			// turn around!
			sprite.dx = - sprite.dx;
			sprite.dy = - sprite.dy;			
			return;
		}
	}

	if (kind.chases) {
		let near = Game.getNearest({sprite, game, types:kind.chases, limit:5});
		if (near) {
			Sprite.turnTowards(sprite, near);
			
			// close enough to bite?
			// TODO collision test instead - cos this requires near total overlap
			if (dist2(sprite,near) < 100) {
				doBite(sprite,near);
			}

			return;
		}		
	}

	// wander
	if (Math.random() <	0.1) {
		// pick a direction	
		sprite.theta = Math.random()*Math.PI*2;
		sprite.dx = Math.cos(sprite.theta) * (sprite.speed || kind.speed || 10);
		sprite.dy = Math.sin(sprite.theta) * (sprite.speed || kind.speed || 10);
		return;
	}
};

const doBite = (predator, prey) => {
	if (prey.health===undefined) prey.health = 100;
	prey.health -= predator.attack || 5;
	console.log("Bite! "+predator.kind+" "+prey.kind+" -> "+prey.health);
	if (prey.health < 0) {
		if (predator.health < 100) predator.health += 5;
		doDie(Game.get(), prey);
	}
};

const doDie = (game, sprite) => {
	// TODO death sequence - or maybe we replace the sprite with a "dying sprite"
	Game.removeSprite(game, sprite);
};

// NB: allow no-import use
window.KindOfCreature = KindOfCreature;
export default KindOfCreature;
