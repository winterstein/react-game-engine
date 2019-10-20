/**
 * Let's define some nice sprites for easy use :)
 */
import Sprite from './Sprite';

const SpriteLib = {};

SpriteLib.chicken = () => new Sprite({
	src:'/img/animals/chicken_large.png',
	tileSize: [48,48],
	tileMargin: {top:0, right:0},
	tiles: [8,12],
	animate: {frames:[24,25,26], dt:200}
});

SpriteLib.goat = () => new Sprite({
	src:'/img/animals/goats.png',
	tileSize: [37,36],
	frames:[[290,61], [338,61], [386,60], 
		[296,109], [344,108], [391,109]],
	animate: {frames:[3,4,5], dt:400},
});

SpriteLib.frog = () => new Sprite({
	src:'/img/animals/largefrog.png',
	// tileSize: [37,36],
	tiles:[8,12],
	animations: {
		left: {frames:[12,13,14]}, 
		right: {frames:[24,25,26]}, 
		up: {frames:[36,37,38]}, 
		down: {frames:[0,1,2]} 
	},
	animate: {frames:[24,25,26], dt:400},
});

SpriteLib.shark = () => new Sprite({
	src:'/img/fish/shark.png',
	tiles: [4,3],
	animate: {frames:[3,4,5], dt:400},
});

window.SpriteLib = SpriteLib;
export default SpriteLib;
