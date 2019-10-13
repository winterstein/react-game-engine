
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
import Rect from './data/Rect';
import FrogGamePage from './components/FrogGamePage';

let initFlag = false;

const init = () => {
	if (initFlag) return;
	const game = Game.get();
	let stage = new Stage();
	Game.setStage(game, stage);	
	stage.init = true;
	initFlag = true;

	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';
	Stage.setGrid(stage, grid);

	// players
	if ( ! game.players || game.players.length===0) {
		Game.setPlayers(game, [new Player({name:"Player 1"})]);	
	}
	// ...positions etc
	game.players.forEach((player, i) => {
		Object.assign(player, {x:5, y:5 + i*2, src:'/img/animals/chicken_large.png',
			tileSize: [48,48],
			tileMargin: {top:0, right:0},
			tiles: [8,12],
			animate: {frames:[24+i*6,25+i*6,26+i*6], dt:200}
		});
		Sprite.initFrames(player);
		Stage.addSprite(stage, player);
	});

	// Monsters
	let goat = new Monster({x:2, y:1,
		src:'/img/animals/goats.png',
		tileSize: [37,36],
		frames:[[290,61], [338,61], [386,60], 
			[296,109], [344,108], [391,109]],
		animate: {frames:[3,4,5], dt:400},
		dx:0.1, 
		dy:0.1,
	});
	Stage.addSprite(stage, goat);

	let honeyBadger = new Monster({x:12, y:4,
		src:'/img/animals/badger.png',
		tileSize: [48,48],
		tiles:[8,12],
		animate: {frames:[15,16,17], dt:400},
		dx: - 0.1, 
		dy: 0.1,
	});
	Stage.addSprite(stage, honeyBadger);
	let babyBear = new Monster({x:10, y:6,
		src:'/img/animals/bear cubs.png',
		tileSize: [48,48],
		tiles:[8,12],
		animate: {frames:[12*7,12*7+1,12*7+2], dt:400},
		dx: - 0.1, 
		dy: 1,
	});
	Stage.addSprite(stage, babyBear);
	let babyBear2 = new Monster({x:11, y:6,
		src:'/img/animals/bear cubs_large pandas.png',
		tileSize: [48,48],
		tiles:[8, 12],
		animate: {frames:[12*6 + 9,12*6 + 10,12*6 +11], dt:400},
		dx: - 0.1, 
		dy: 1,
	});
	Stage.addSprite(stage, babyBear2);

	// some tiles

	let wall = new Tile({
		src:'/img/bricksx64.png',
	});
	for(let wi=4; wi<10; wi++) {
		let walli = new Tile(wall);
		walli.id = 'wall'+wi;
		walli.x = wi; walli.y = 8;
		Stage.addSprite(stage, walli);
	}
	for(let wi=9; wi<20; wi++) {
		let walli2 = new Tile(wall);
		walli2.id = 'wall2'+wi;
		walli2.x = wi; walli2.y = 0;
		Stage.addSprite(stage, walli2);
	}
	for(let wi=1; wi<8; wi++) {
		let walli2 = new Tile(wall);
		walli2.id = 'wall3'+wi;
		walli2.x = 15; walli2.y = wi;
		Stage.addSprite(stage, walli2);
	}

	// super init
	Game.init();	
};

const FrogGame = {init};

export default FrogGame;
