
import DataStore from './base/plumbing/DataStore';
import {getDataClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Sprite from './data/Sprite';
import Player from './data/Player';
import Monster from './data/Monster';
import Card from './data/Card';
import Game from './Game';
import Snake from './data/Snake';

let initFlag = false;

let init = () => {
	if (initFlag) return;
	const game = Game.get();
	let stage = Stage.make();
	game.stage = stage;

	// one snake
	let snake = Snake.make({x:100, y:100, length:100, width:200, height:100});
	Stage.addSprite(stage, snake);
	if (true) {
		Game.init();
		return;
	}

	// make sprites
	let player = Player.make({name:"Dan", x:10, y:10, src:'/img/obi-wan-kenobi.png',
		height:127, width:70,
		frames:['-3px -4px', '-94px -4px', '-186px -4px', '-273px -4px', 
			'-360px -4px', '-456px -4px', '-550px -4px', '-637px -4px'],
		animate: {frames:[0,1,2,3,4,5,6,7], dt:400}
	});
	DataStore.setValue(['data', 'Sprite', 'player'], player);

	// Monsters
	let goat = Monster.make({x:50, y:50,
		src:'/img/animals/goats.png',
		width:37, height:36,
		frames:['-290px -61px', '-338px -61px', '-386px -60px', 
			'-296px -109px', '-344px -108px', '-391px -109px'],
		animate: {frames:[3,4,5], dt:400}
	});

	// some tiles
	let tree = Sprite.make({x:100, y:100, src:'/img/tiles/green.png',
		height:300, width:200,
		frames:['0px -12px', '-235px -15px', '-486px -15px', '-716px -35px', '-943px -11px', '-1180px -11px'],
		frame: 0,
	});
	DataStore.setValue(['data', 'Sprite', 'tree'], tree);

	Stage.addSprite(stage, player);
	Stage.addSprite(stage, goat);
	Stage.addSprite(stage, tree);
	let tree2 = Sprite.make(tree);
	tree2.id = 'tree2';
	tree2.frame = 3; tree2.x = 500;
	Stage.addSprite(stage, tree2);

	let grass = Sprite.make(tree);
	grass.id = 'grass';
	grass.height = 150;
	grass.dropzone = true;
	grass.zIndex = -1;
	grass.frame = 2; grass.x = 300;
	Stage.addSprite(stage, grass);
	
	let grass2 = Sprite.make(grass);
	grass2.id = 'grass2';
	grass2.frame = 4; grass2.x = 400; grass2.y += 100;
	Stage.addSprite(stage, grass2);		

	// cards
	let wall = Sprite.make({src:''});
	let seed = Sprite.make({src:'/img/FruitTreeSeed.png'});
	game.cards = [
		Card.make({id:'wall', sprite:wall}),
		Card.make({id:'seed', sprite:seed})
	];

	Game.init();
};

const MyGame = {init};

export default MyGame;
