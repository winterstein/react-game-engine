
import Game from './Game';
import StopWatch from './StopWatch'
import Sprite from './data/Sprite';

/**
 * @param {!Game} game
 */
Game.update = game => {
	// tick
	if ( ! StopWatch.update(game.ticker)) {
		return;
	}	
	// TODO update stage and sprites
	Object.values(game.sprites).forEach(s => updateSprite(s,game));

	// player
	let player = Game.getPlayer(game);
	if (player) {
		let rc = Game.getTileInFront(game, player);
		// TODO shine!
		// console.log("Game.getTileInFront", rc);
		let selectTile = game.sprites.selectTile;
		if (selectTile) {			
		}		
	}

	// collisions?

	// off screen?

	// focus on X?
};

/**
 * 
 * @param {!Sprite} s 
 */
const updateSprite = (s, game) => {
	if (Tile.isa(s)) {
		return; // no update 
	}

	// What would the sprite like to do?
	if (s.name) {
		let ufn = updaterForAnimal[s.name];
		if (ufn) ufn(s, game);
	}

	s.oldX = s.x; // NB: record old x,y so we can step-back onCollision
	s.oldY = s.y;

	const dt = StopWatch.dt(game.ticker);
	s.x += s.dx * dt;
	s.y += s.dy * dt;
	s.z += s.dz * dt;

	// set animation from dx/dy
	if (s.dy < 0) Sprite.animate(s, 'up');
	if (s.dy > 0) Sprite.animate(s, 'down');
	if (s.dx < 0) Sprite.animate(s, 'left');
	if (s.dx > 0) Sprite.animate(s, 'right');
	if ( ! s.dx && ! s.dy) Sprite.animate(s, 'stop');

	Sprite.updateAnimation(s, game);

	Sprite.setPixiProps(s);
};

const updateSheep = (sprite,game) => {
	// mostly no change
	if (Math.random() < 0.99) return;
	// pick a direction
	sprite.speed = 20;
	sprite.theta = Math.random()*Math.PI*2;
	sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 1);
	sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 1);
};

const updaterForAnimal = {
	'Sheep': updateSheep,
	'Frog': updateSheep,
	'Wolf': updateSheep,
	'Werewolf': updateSheep,
	'Chicken': updateSheep,
	'Badger': updateSheep,
	'Fish': updateSheep,
	'Goat': updateSheep,
};

export default {}; // dummy export to keep imports happy
export {
	updaterForAnimal
}
