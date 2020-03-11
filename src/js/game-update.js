
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

	// collisions?

	// off screen?

	// focus on X?
};

export default {}; // dummy export to keep imports happy