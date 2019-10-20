
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

/**
 * Bind your players to keys here
 * 
 * There's also a utility:
 * GameControls.playerForKeyArrows(player)
 */
GameControls.playerForKey = {};
/**
 * Convenience for binding the arrows
 * @param {Player} p
 */
GameControls.playerForKeyArrows = p => {
	GameControls.playerForKey.ArrowLeft = p;
	GameControls.playerForKey.ArrowRight = p;
	GameControls.playerForKey.ArrowUp = p;
	GameControls.playerForKey.ArrowDown = p;
};

GameControls.onKeyDown = e => {
	let player = GameControls.playerForKey[e.key];
	console.log("keyDown", e.key, player);
	if ( ! player) return;
	let v = 1;
	let a;
	if (e.key==='ArrowLeft') {
		player.dx = -v;
		// player.dy = -v;
		a = 'left';
	}
	if (e.key==='ArrowRight') {
		player.dx = v;
		// player.dy = v;
		a = 'right';
	}
	if (e.key==='ArrowUp') {
		// player.dx = v;
		player.dy = -v;		
		a = 'up';
	}
	if (e.key==='ArrowDown') {
		// player.dx = -v;
		player.dy = v;
		a = 'down';
	}
	if (player.animations && player.animations[a]) {
		if (player.animate.name !== a) {			
			player.animate = Object.assign({name:a}, player.animations[a]); // safety copy
			console.log("set animation", a, player.animations[a], player.animate);
		}
	}
	return false;
};

GameControls.onKeyUp = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	player.dx = 0; player.dy = 0;
	player.animate.frames = [player.animate.frames[0]]; // stop animating [0,1,2,3,4,5,6,7];
};

export default GameControls;
