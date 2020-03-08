
import DataStore from './base/plumbing/DataStore';
import {getClass} from './base/data/DataClass';
import Stage from './data/Stage';
import Grid from './data/Grid';
import Sprite from './data/Sprite';
import SpriteLib from './data/SpriteLib';
import Tile from './data/Tile';
import Player from './data/Player';
import Monster from './data/Monster';
import Card from './data/Card';
import Game from './Game';
import Rect from './data/Rect';
import GameControls from './GameControls';
import { assert } from 'sjtest';

let initFlag = false;

const init = () => {
	if (initFlag) return;
	const game = Game.get();
	let stage = new Stage();
	Game.setStage(game, stage);	
	stage.init = true;
	initFlag = true;

	// stage.backgroundImage = '/img/bg/fishtank-bg.jpg';

	// How big is the Stage?
	const grid = Grid.get();
	grid.width = 30; grid.height = 12;
	grid.display = '2d';
	Stage.setGrid(stage, grid);

	// players
	if ( ! game.players || game.players.length===0) {
		let p0 = new Player(SpriteLib.frog(),{name:"Player 1"});
		Game.setPlayers(game, [p0]);
	}
	// ...positions etc
	game.players.forEach((player, i) => {
		Object.assign(player, {x:3, y:3 + i*2, dx:0, dy:0});
		Stage.addSprite(stage, player);
	});

	let p0 = game.players[0];
	GameControls.playerForKeyArrows(p0);

	let spawn = new Sprite({
		src:'/img/animals/frogspawn.png',
		x:12, y:5,
	});
	Stage.addSprite(stage, spawn);


	// Monsters
	let shark = new Monster(SpriteLib.shark(), 
		{	x:10, y:1,
			dx:-0.1, 
			dy:0.1,
		});
	assert(shark.x, shark);
	Stage.addSprite(stage, shark);

	let alligator = new Monster(SpriteLib.alligator(0), 
		{	x:7, y:1,
			dx:0.1, 
			dy:0.1,
			width:2,height:2
		});
	// Stage.addSprite(stage, alligator);

	let bindo = new Monster(SpriteLib.alligator(1), 
		{	x:7, y:7,
			dx:0.4, 
			dy:0,
			width:3, height:1
		});
	// Stage.addSprite(stage, bindo);

	let fish1 = new Monster(SpriteLib.fish(), 
		{	x:15, y:3,
			dx:-0.3, 
		});
	Sprite.animate(fish1, 'left');
	Stage.addSprite(stage, fish1);

	let fish2 = new Monster(SpriteLib.fish(1), 
		{	x:6, y:5,
			dx:0.3, 
		});
	Sprite.animate(fish2, 'right');
	Stage.addSprite(stage, fish2);

	let fish3 = new Monster(SpriteLib.fish(2), 
	{	x:1, y:4,
		dx:0.3, 
	});
	Sprite.animate(fish3, 'right');
	Stage.addSprite(stage, fish3);

	// some tiles
	// let wall = new Tile({
	// 	src:'/img/bricksx64.png',
	// 	frames: []
	// });
	// for(let wi=4; wi<10; wi++) {
	// 	let walli = new Tile(wall);
	// 	walli.id = 'wall'+wi;
	// 	walli.x = wi; walli.y = 12;
	// 	Stage.addSprite(stage, walli);
	// }
	// for(let wi=9; wi<20; wi++) {
	// 	let walli2 = new Tile(wall);
	// 	walli2.id = 'wall2'+wi;
	// 	walli2.x = wi; walli2.y = 0;
	// 	Stage.addSprite(stage, walli2);
	// }
	// for(let wi=1; wi<8; wi++) {
	// 	let walli2 = new Tile(wall);
	// 	walli2.id = 'wall3'+wi;
	// 	walli2.x = 15; walli2.y = wi;
	// 	Stage.addSprite(stage, walli2);
	// }

	// Rules


	// super init
	Game.init();	
};

const FrogGame = {init};

export default FrogGame;