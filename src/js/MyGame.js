
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
	const game = Game.get();
	let stage = new Stage();
	game.stage = stage;	

	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 100; grid.height = 12;
	grid.display = '2d';
	Stage.setGrid(stage, grid);

	// one snake
	let snake = new Snake({x:1, y:1, width:4, height:1});
	Stage.addSprite(stage, snake);

	// one player
	let player = new Player({name:"Dan", x:5, y:5, src:'/img/animals/chicken_large.png',
		screenHeight:48, screenWidth:48,
		tileSize: [48,48],
		tileMargin: {top:0, right:0},
		tiles: [8,12],
		animate: {frames:[24,25,26], dt:200}
	});
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

	Stage.addSprite(stage, goat);

	// let tree = new Tile({
	// 	src:'/img/tilesetOpenGame.png',
	// 	frames: [[210,20]]
	// });
	// tree.x = 10; tree.y=10;
	// Stage.addSprite(stage, tree);

	// super init
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

Player.onOffScreen = (sp, {dx, dy}) => {
	console.warn("OFF", dx, dy, sp);
	if (dy) {
		console.error("LOSE");
		Sprite.addCommand(sp, {name:"die"});
		return;
	}
	if (dx) console.error("WIN");
};

const MyGame = {init};

export default MyGame;
