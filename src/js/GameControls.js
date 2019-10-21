
// TODO arrow keys
// TODO selection manager
import Game from './Game';
import DataStore from './base/plumbing/DataStore';
import { stopEvent } from 'wwutils';

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

GameControls.onKeyDown = e => onkey(e, true);

const onkey = (e, isDown) => {
	let player = GameControls.playerForKey[e.key];
	// console.log("key", e.key, player);
	if ( ! player) return;
	let v = 1;
	let a;
	if (e.key==='ArrowLeft') {
		player.dx = isDown? -v : 0;
		// player.dy = -v;
		a = 'left';
	}
	if (e.key==='ArrowRight') {
		player.dx = isDown? v : 0;
		// player.dy = v;
		a = 'right';
	}
	if (e.key==='ArrowUp') {
		// player.dx = v;
		player.dy = isDown? -v : 0;		
		a = 'up';
	}
	if (e.key==='ArrowDown') {
		// player.dx = -v;
		player.dy = isDown? v : 0;
		a = 'down';
	}
	if (player.animations && player.animations[a]) {
		if (isDown && player.animate.name !== a) {			
			player.animate = Object.assign({name:a}, player.animations[a]); // safety copy
			console.log("set animation", a, player.animations[a], player.animate);
		}
		if ( ! isDown && player.animate.name === a) {
			player.animate.frames.splice(1); // first frame
			console.log("stop animation", a, player.animations[a], player.animate);
		}
	}
	// consume the event?
	if (a) {
		stopEvent(e);
		return false;
	}
	return true;
};

GameControls.onKeyUp = e => onkey(e,false);

let keyFlag;
/** install controls  */
GameControls.init = () => {
	if (keyFlag) return;
	const body = window; //document.body;
	body.onkeydown = GameControls.onKeyDown;
	body.onkeyup = GameControls.onKeyUp;
	// body.addEventListener('keyDown', GameControls.onKeyDown);
	// body.addEventListener('keyUp', GameControls.onKeyUp);
	keyFlag = true;
	console.log("Key listeners added");
};

export default GameControls;
