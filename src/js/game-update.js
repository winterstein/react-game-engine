
import Game from './Game';
import StopWatch from './StopWatch'

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
	s.pixi.x = s.x;
	s.pixi.y = s.y;
};

export default {}; // dummy export to keep imports happy