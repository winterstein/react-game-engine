
import DataStore from './base/plumbing/DataStore';
import {getClass} from './base/data/DataClass';
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
	let stage = new Stage();
	game.stage = stage;	

	// make sprites
	// Monsters
	let goat = new Monster({x:50, y:50,
		src:'/img/animals/goats.png',
		width:64, height:64,
		tileSize: [37,36],
		frames:[[290,61], [338,61], [386,60], 
			[296,109], [344,108], [391,109]],
		animate: {frames:[3,4,5], dt:400}
	});
	let duck = new Monster({x:50, y:50,
		src:'/img/animals/ducks.png',
		width:48, height:48,
		tileSize: [38,38],
		tileMargin: {top:10, right:10},
		tiles: [8, 12],
		animation: {
			'walk-left': {frames:[63,64,65], dt:400}
		}
	});

	// some tiles
	Stage.addSprite(stage, goat);

	game.sprites = {goat, duck};

	Game.init();
};

const MultiplayerGame = {init};

export default MultiplayerGame;
