
import Game from './Game';

/**
 * @param {!Game} game
 */
Game.update = game => {
	// tick
	if ( ! StopWatch.update(game.ticker)) {
		return;
	}
	// TODO update stage and sprites
	Object.values(game.sprites).forEach(s => {
		s.x += s.dx;
		s.y += s.dy;
		s.z += s.dz;
		s.pixi.x = s.x;
		s.pixi.y = s.y;
	});

	// collisions?

	// off screen?

	// focus on X?
};

export default {}; // dummy export to keep imports happy