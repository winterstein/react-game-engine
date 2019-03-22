
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Player extends Sprite {

}
DataClass.register(Player,'Player');
export default Player;


Player.doCommand = (player, cmd) => {
	player.dy = - player.dy || 1;
	cmd.done = true;
};
