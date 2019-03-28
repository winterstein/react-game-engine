
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';
import Grid from './Grid';

class Snake extends Sprite {
	
}
DataClass.register(Snake, 'Snake');
const This = Snake;
const Super = Sprite;
export default Snake;

/**
 * renders into a positioned mini-canvas
 */
Snake.render = (sprite, ctx) => {
	let sections = 20;
	let ptopx, ptopy, pbotx, pboty;
	const width = sprite.width * 50;
	const height = sprite.height * 50;
	let sw = width / sections;
	let w = 2;
	let h2 = (height - 6*w) / 2; // NB: subtract extra w for head width space

	let sxy = Grid.screenFromGame(sprite);

	for(let i=0; i<sections; i++) {
		let x = i*sw;
		let r = (x + sxy.x+sxy.y) * Math.PI * 4 / width;		
		let y = 2*w + h2*(1+Math.sin(r));	// extra w for the head space
		let nx = - Math.cos(r);
		let ny = 1;
		let topx = x - nx*w;
		let topy = y - ny*w;
		let botx = x + nx*w;		
		let boty = y + ny*w;
		if (ptopx) {
			let stripe = i % 3;
			let s = stripe===0? "#FF00" : (stripe===1? "00FF" : "#0000");
			let sr = ((i*345) % 100);
			if (sr < 10) sr = "0"+sr;
			s += sr;
			ctx.fillStyle = s;
			// Or use a bezier curve??
			ctx.beginPath();
			ctx.moveTo(ptopx, ptopy);
			ctx.lineTo(pbotx, pboty);
			ctx.lineTo(botx, boty);
			ctx.lineTo(topx, topy);
			ctx.closePath();
			ctx.fill();
		}
		ptopx = topx;
		ptopy = topy;
		pbotx = botx;
		pboty = boty;
	}
	// head
	let cx = (ptopx+pbotx)/2, cy = (ptopy+pboty)/2;
	ctx.beginPath();
	ctx.arc(cx, cy, w*3, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();
}; // ./render

Snake.update = (sprite, game) => {
	sprite.canvas = true;
	// TODO adjust
	sprite.dx = 0.1; 
	sprite.dy = 0.1;

	Super.update(sprite, game);	
};
