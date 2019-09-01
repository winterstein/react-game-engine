
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
		// Object.assign(player, {x:5, y:5 + i*2, src:'/img/animals/chicken_large.png',
		// 	tileSize: [48,48],
		// 	tileMargin: {top:0, right:0},
		// 	tiles: [8,12],
		// 	animate: {frames:[24+i*6,25+i*6,26+i*6], dt:200}
		// });
		// Sprite.initFrames(player);
		// Stage.addSprite(stage, player);
	});

	let earth = new Tile({
		x:5, y:5,
		src:'/img/bg/spinning-earth.gif',
		height: 10,
		width: 10
	});
	Stage.addSprite(stage, earth);

	// // Monsters
	let goat = new Monster({x:2, y:1,
		src:'/img/animals/raccoons.png',
		tileSize: [48,48],
		animate: {frames:[3,4,5], dt:400},
		dx:0.1, 
		dy:0.1,
	});
	Stage.addSprite(stage, goat);

	// some tiles
	let fish = new Sprite({
		x:10, y:10,
		src:'/img/fish/fishtype1.png',
		tileSize: [48,48],
		tiles: [8,12],
		frame: 34,
		animate: {frames:[33,34,35,34], dt:300},
		dx:0.1, 
		dy:0.1,
	});
	Sprite.initFrames(fish);
	Stage.addSprite(stage, fish);

	// super init
	Game.init();
};

const SaveTheWorldGame = {init};

export default SaveTheWorldGame;
