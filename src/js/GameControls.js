
// TODO arrow keys
// TODO selection manager
import Game from './Game';
import DataStore from './base/plumbing/DataStore';

const GameControls = {};

GameControls.select = ({sprite, stage}) => {
	if ( ! stage) {
		stage = Game.getStage();
	}
	if (sprite) sprite.selected = true;
	if ( ! stage) {
		return;
	}
	stage.sprites.forEach(s => {
		s.selected = s===sprite;
	});
};

export default GameControls;
