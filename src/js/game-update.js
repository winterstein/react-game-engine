
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

	Sprite.updateAnimation(s, game);

	Sprite.setPixiProps(s);
};

export default {}; // dummy export to keep imports happy