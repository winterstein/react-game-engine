/**
 * Let's define some nice sprites for easy use :)
 */
import Sprite from './Sprite';

const SpriteLib = {};

const stdAnimal = (src,n=0,name) => {
	let sp = new Sprite({
		name,
		src,
		tiles: [8,12],
		animations: {
			left: {frames:[12+n*3,13+n*3,14+n*3,13+n*3]}, 
			right: {frames:[24+n*3,25+n*3,26+n*3,25+n*3]}, 
			up: {frames:[36+n*3,37+n*3,38+n*3]}, 
			down: {frames:[0+n*3,1+n*3,2+n*3]} 
		},
	});
	// ??starting animation??
	Sprite.animate(sp, 'right');
	return sp;
};

SpriteLib.chicken = n => stdAnimal('/img/animals/chicken_large.png',n);

SpriteLib.goat = n => stdAnimal('/img/animals/goats.png', n);

SpriteLib.frog = n => stdAnimal('/img/animals/largefrog.png', n);

SpriteLib.alligator = n => {
	let a = stdAnimal('/img/animals/alligators.png', n, 'alligator');
	// TODO mask square to rectangle to fit alligator shape
	// TODO or pixel mask logic for collisions
	return a;
};


SpriteLib.shark = () => new Sprite({
	name:'shark',
	src:'/img/fish/shark.png',
	tiles: [4,3],
	animate: {frames:[3,4,5], dt:400},
});

SpriteLib.fish = n => stdAnimal('/img/fish/fishtype1.png', n, 'fish');

window.SpriteLib = SpriteLib;
export default SpriteLib;
