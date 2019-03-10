
import DataStore from './base/plumbing/DataStore';
import {getDataClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import Player from './data/Player';
import Monster from './data/Monster';
import Card from './data/Card';
import Game from './Game';
import Snake from './data/Snake';

let initFlag = false;

let init = () => {
	if (initFlag) return;
	console.log("MyGame.js - init");
	const game = Game.get();
	let stage = new Stage();
	game.stage = stage;	

	// How big is the Stage?
	const grid = new Grid({width:10, height:10});
	Stage.setGrid(stage, grid);

	// one snake
	let snake = new Snake({x:1, y:1, width:200, height:50});
	Sprite.assIsa(snake);

	Stage.addSprite(stage, snake);

	if (false) {
		Game.init();
		return;
	}

	// make sprites
	let player = new Player({name:"Dan", x:5, y:5, src:'/img/obi-wan-kenobi.png',
		height:127, width:70,
		frames:[[3,4], [94, 4], [186,4], [273,4], 
			[360,4], [456,4], [550,4], [637,4]],
		animate: {frames:[0,1,2,3,4,5,6,7], dt:400}
	});
	DataStore.setValue(['data', 'Sprite', 'player'], player, false);

	// Monsters
	let goat = new Monster({x:2, y:1,
		src:'/img/animals/goats.png',
		width:64, height:64,
		tileSize: [37,36],
		frames:[[290,61], [338,61], [386,60], 
			[296,109], [344,108], [391,109]],
		animate: {frames:[3,4,5], dt:400}
	});

	// some tiles
	let tree = new Sprite({x:3, y:3, src:'/img/tiles/green.png',
		height:300, width:200,
		frames:[[0, 12], [235,15], [486,15], [716,35], [943,11], [1180,11]],
		frame: 0,
	});
	DataStore.setValue(['data', 'Sprite', 'tree'], tree, false);

	Stage.addSprite(stage, player);

	Stage.addSprite(stage, goat);

	Stage.addSprite(stage, tree);

	let tree2 = new Sprite(tree);
	tree2.id = 'tree2';
	tree2.frame = 3; 
	tree2.x = 50; tree.y=50;
	// Stage.addSprite(stage, tree2);

	let grass = new Sprite(tree);
	grass.id = 'grass';
	grass.height = 150;
	grass.dropzone = true;
	grass.zIndex = -1;
	grass.frame = 2; 
	grass.y = 150; grass.x = 150;
	Stage.addSprite(stage, grass);
	
	let grass2 = new Sprite(grass);
	grass2.id = 'grass2';
	grass2.frame = 4; grass2.x += 0; grass2.y += 75;
	Stage.addSprite(stage, grass2);		

	// cards
	// let wall = new Sprite({src:''});
	let seed = new Sprite({src:'/img/FruitTreeSeed.png'});
	game.cards = [
		// new Card({id:'wall', sprite:wall}),
		new Card({id:'seed', sprite:seed})
	];

	Game.init();
};

const MyGame = {init};

export default MyGame;
