/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import C from '../C';
import Game from '../Game';
import Misc from '../base/components/Misc';
import Player from '../data/Player';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import Tile from '../data/Tile';
import VStage from './VStage';

let onKeyDown = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	if (e.key==='ArrowLeft') {
		player.dx = -5;
		player.dy = -5;
		player.animate.frames = [2,1,2];
	}
	if (e.key==='ArrowRight') {
		player.dx = 5;
		player.dy = 5;
		player.animate.frames = [6,7,6];
	}
	if (e.key==='ArrowUp') {
		player.dx = 5;
		player.dy = -5;
		player.animate.frames = [4,3,4,5];
	}
	if (e.key==='ArrowDown') {
		player.dx = -5;
		player.dy = 5;
		player.animate.frames = [0];
	}
};

const onKeyUp = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	player.dx = 0; player.dy = 0;
	player.animate.frames = [player.animate.frames[0]]; // stop animating [0,1,2,3,4,5,6,7];
};


const GamePage = () => {
	
	let stage = DataStore.getValue('data','Stage','main');
	if ( ! stage) {
		Game.init();
		let player = Player.make({name:"Dan", x:10, y:10, src:'/img/obi-wan-kenobi.png',
			height:127, width:70,
			frames:['-3px -4px', '-94px -4px', '-186px -4px', '-273px -4px', 
				'-360px -4px', '-456px -4px', '-550px -4px', '-637px -4px'],
			animate: {frames:[0,1,2,3,4,5,6,7], dt:4}
		});
		DataStore.setValue(['data', 'Sprite', 'player'], player);

		// some tiles
		let tree = Sprite.make({x:100, y:100, src:'/img/tiles/green.png',
			height:300, width:200,
			frames:['0px -12px', '-235px -15px', '-486px -15px', '-716px -35px', '-943px -11px', '-1180px -11px'],
			frame: 0,
		});
		DataStore.setValue(['data', 'Sprite', 'tree'], tree);

		stage = Stage.make();
		Stage.addSprite(stage, player);
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

		DataStore.setValue(['data', 'Stage', 'main'], stage);
	}

	// NB tabIndex needed for onKeyDown to work
	return (<div tabIndex="1" className='GamePage'
		onLoad={() => this.refs.item.focus()}
		onClick={e => DataStore.update()} onKeyDown={onKeyDown}
		onKeyUp={onKeyUp} 
	>
		<VStage stage={stage} />
	</div>);

};

export default GamePage;
