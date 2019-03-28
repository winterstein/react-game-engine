
import DataStore from './base/plumbing/DataStore';
import {getClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import Tile from './data/Tile';
import Player from './data/Player';
import Monster from './data/Monster';
import Card from './data/Card';
import Game from './Game';
import Snake from './data/Snake';
import Rect from './data/Rect';

let initFlag = false;

let init = () => {
	if (initFlag) return;
	console.log("MyGame.js - init");
	const game = Game.get();
	let stage = new Stage();
	game.stage = stage;	

	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 20; grid.height = 8;
	grid.display = '2d';
	Stage.setGrid(stage, grid);

	// one snake
	let snake = new Snake({x:1, y:1, width:4, height:1});
	Sprite.assIsa(snake);

	Stage.addSprite(stage, snake);

	if (false) {
		Game.init();
		return;
	}

	// make sprites
	// let player = new Player({name:"Dan", x:5, y:5, src:'/img/obi-wan-kenobi.png',
	// 	height:127, width:70,
	// 	frames:[[3,4], [94, 4], [186,4], [273,4], 
	// 		[360,4], [456,4], [550,4], [637,4]],
	// 	animate: {frames:[0,1,2,3,4,5,6,7], dt:400}
	// });

	let player = new Player({name:"Dan", x:5, y:5, src:'/img/animals/chicken_large.png',
		screenHeight:48, screenWidth:48,
		tileSize: [48,48],
		tileMargin: {top:0, right:0},
		tiles: [8,12],
		animate: {frames:[24,25,26], dt:200}
	});
	DataStore.setValue(['data', 'Sprite', 'player'], player, false);
	Game.setPlayers(game, [player]);
	Stage.addSprite(stage, player);

	// Monsters
	let goat = new Monster({x:2, y:1,
		src:'/img/animals/goats.png',
		screenWidth:64, screenHeight:64,
		tileSize: [37,36],
		frames:[[290,61], [338,61], [386,60], 
			[296,109], [344,108], [391,109]],
		animate: {frames:[3,4,5], dt:400},
		dx:0.1, 
		dy:0.1,
	});


	// some tiles

	let wall = new Tile({
		src:'/img/bricksx64.png',
		// screenWidth:50, screenHeight:50,
	});
	for(let wi=4; wi<20; wi++) {
		let walli = new Tile(wall);
		walli.id = 'wall'+wi;
		walli.x = wi; walli.y = 8;
		Stage.addSprite(stage, walli);

		let walli2 = new Tile(wall);
		walli2.id = 'wall2'+wi;
		walli2.x = wi; walli2.y = 0;
		Stage.addSprite(stage, walli2);
	}

	let tree = new Tile({x:3, y:3, src:'/img/tiles/green.png',
		height:3, width:2,
		frames:[[0, 12], [235,15], [486,15], [716,35], [943,11], [1180,11]],
		frame: 0,
	});


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

	// UI??

	// cards
	// let wall = new Sprite({src:''});
	let seed = new Sprite({src:'/img/FruitTreeSeed.png'});
	game.cards = [
		// new Card({id:'wall', sprite:wall}),
		new Card({id:'seed', sprite:seed})
	];

	Game.init();
};

Stage.testCollisions = stage => {
	const players = stage.sprites.filter(sp => Player.isa(sp));
	const tiles = stage.sprites.filter(sp => Tile.isa(sp));
	Stage.testCollisionsBetween(players, tiles);
};

Stage.testCollisionsBetween = (sprites1, sprites2) => {
	sprites1.forEach(s1 => {
		sprites2.forEach(s2 => {
			if ( ! Rect.intersects(s1, s2)) return;
			const t1 = getClass(s1);
			const t2 = getClass(s2);
			if (t1.onCollision) t1.onCollision(s1, s2);
			if (t2.onCollision) t2.onCollision(s2, s1);
		});
	});
};

Player.onCollision = (p, s) => {
	// block	
	if (p.oldY !== undefined && p.dy) {
		p.y = p.oldY;
		return;
	}
	if (p.oldX !== undefined) {
		p.x = p.oldX;
	}	
};

/**
 * on start: go forward
 */
Stage.start = function(stage, game) {
	if (stage.flag && stage.flag.start) return;
	game.players.forEach(p => {
		p.dx = 2;
		p.dy = 2;
	});
	if ( ! stage.flag) stage.flag = {};
	stage.flag.start = true;
};

const MyGame = {init};

export default MyGame;
