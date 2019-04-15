
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
		// TODO death animation	
		let boom = new Sprite(Sprite.library.boom);
		boom.x = player.x; boom.y = player.y;
		const stage = Game.getStage();
		Stage.addSprite(stage, boom);
		// Sprite.addCommand(new Command()); vanish
		player.hidden = true;
		// stop
		player.dx = 0; player.dy = 0;
		cmd.done = true;
	}
};
