
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
	// let snake = Snake.make({x:100, y:100, length:100, width:200, height:50});
	// Stage.addSprite(stage, snake);

	// make sprites
	let player = Player.make({name:"Dan", x:10, y:10, src:'/img/obi-wan-kenobi.png',
		height:127, width:70,
		frames:[[3,4], [94, 4], [186,4], [273,4], 
			[360,4], [456,4], [550,4], [637,4]],
		animate: {frames:[0,1,2,3,4,5,6,7], dt:400}
	});
	DataStore.setValue(['data', 'Sprite', 'player'], player);

	// Monsters
	let goat = Monster.make({x:50, y:50,
		src:'/img/animals/goats.png',
		width:64, height:64,
		tileSize: [37,36],
		frames:[[290,61], [338,61], [386,60], 
			[296,109], [344,108], [391,109]],
		// animate: {frames:[3,4,5], dt:400}
	});

	// some tiles
	let tree = Sprite.make({x:100, y:100, src:'/img/tiles/green.png',
		height:300, width:200,
		frames:[[0, 12], [235,15], [486,15], [716,35], [943,11], [1180,11]],
		frame: 0,
	});
	DataStore.setValue(['data', 'Sprite', 'tree'], tree);

	// Stage.addSprite(stage, player);

	Stage.addSprite(stage, goat);

	if (true) {
		Game.init();
		return;
	}

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
