
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

export default {}; // dummy export to keep imports happy