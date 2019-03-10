
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

GameControls.onKeyDown = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	let v = 0.5;
	if (e.key==='ArrowLeft') {
		player.dx = -v;
		player.dy = -v;
		player.animate.frames = [2,1,2];
	}
	if (e.key==='ArrowRight') {
		player.dx = v;
		player.dy = v;
		player.animate.frames = [6,7,6];
	}
	if (e.key==='ArrowUp') {
		player.dx = v;
		player.dy = -v;
		player.animate.frames = [4,3,4,5];
	}
	if (e.key==='ArrowDown') {
		player.dx = -v;
		player.dy = v;
		player.animate.frames = [0];
	}
};

GameControls.onKeyUp = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	player.dx = 0; player.dy = 0;
	player.animate.frames = [player.animate.frames[0]]; // stop animating [0,1,2,3,4,5,6,7];
};

export default GameControls;
