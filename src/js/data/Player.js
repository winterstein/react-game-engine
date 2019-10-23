
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';
import Game from '../Game';
import Stage from './Stage';
import { finished } from 'stream';
import Monster from './Monster';
import SpriteLib from './SpriteLib';

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

/**
 * @param {?Sprite} s - Can be unset e.g. edge-of-world collision
 */
Player.onCollision = (p, s, dx, dy) => {
	if (s) {
		if (s.name === 'alligator') {
			console.log("alligator!");
			// Sprite.addCommand(p, {name:"die"}); 
		}
		if (s.name === 'shark') {
			console.log("shark!");
			Sprite.addCommand(p, {name:"die"}); 
		}
		if (s.name === 'fish') {
			if ( ! s.bonked) {
				console.log("bonk!");
				p.score = (p.score || 0) + 1;
				s.dx = - s.dx;
				// TODO animate based on dx/dy
				if (s.animate && s.animate.name==='left') {
					Sprite.animate(s, 'right');
				} else if (s.animate && s.animate.name==='right') {
					Sprite.animate(s, 'left');
				}
				s.bonked = true;
				
				let goleft = Math.random()>0.5;
				let newfish = new Monster(SpriteLib.fish(), 
					{	
						x: goleft? 25 : 0, 
						y: Math.random()*10,
						dx: (goleft? -0.3 : 0.3) * (1.25 - Math.random()*0.5), 
					});
				Sprite.animate(newfish, goleft?'left' : 'right');
				Stage.addSprite(Game.get().stage, newfish);
			}
			return;
		}
	}
	// block
	if (p.oldY !== undefined && dy) {
		p.y = p.oldY;
	}
	if (p.oldX !== undefined && dx) {
		p.x = p.oldX;
	}
};

/** default: treat as a collission */
Player.onOffScreen = (sp, {dx, dy}) => {
	Player.onCollision(sp, null, dx, dy);
};
