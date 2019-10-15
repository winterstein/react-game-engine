
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';
import Game from '../Game';
import Stage from './Stage';


class Player extends Sprite {

}
DataClass.register(Player,'Player');
export default Player;


Player.doCommand = (player, cmd) => {
	if (cmd.name==='fire') {
		// change direction
		player.dy = - player.dy || 1;
		cmd.done = true;
	}
	if (cmd.name==='die') {
		// death animation	
		let boom = new Sprite(Sprite.library.boom);
		boom.x = player.x; boom.y = player.y;
		const stage = Game.getStage();
		Stage.addSprite(stage, boom);
		// Sprite.addCommand(new Command()); vanish
		player.hidden = true;
		// stop
		player.dx = 0; player.dy = 0;
		cmd.done = true;
		console.log("BLEURGH");
	}
};


Player.onCollision = (p, s, dx, dy) => {
	// block
	if (p.oldY !== undefined && dy) {
		p.y = p.oldY;
	}
	if (p.oldX !== undefined && dx) {
		p.x = p.oldX;
	}
	// if s is a monster {
	// Sprite.addCommand(p, {name:"die"}); 
};

Player.onOffScreen = (sp, {dx, dy}) => {
	// console.warn("OFF", dx, dy, sp);
	if (dy) {
		console.error("LOSE");
		Sprite.addCommand(sp, {name:"die"});
		return;
	}
	if (dx) console.error("WIN");
};
