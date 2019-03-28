
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

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
		player.hidden = true;
		player.dx = 0; player.dy = 0;
		cmd.done = true;
	}
};
