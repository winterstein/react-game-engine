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
import Misc from '../base/components/Misc';
import Player from '../data/Player';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import Tile from '../data/Tile';
import VStage from './VStage';

let onKeyDown = e => {
	console.warn('e', e, e.key, e.code, e.keyCode);
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	if (e.key==='ArrowLeft') {
		player.dx = -5;
		player.animate.frames = [2,1,2];
	}
	if (e.key==='ArrowRight') {
		player.dx = 5;
		player.animate.frames = [6,7,6];
	}
	if (e.key==='ArrowUp') {
		player.dy = -5;
		player.animate.frames = [3,4,5];
	}
	if (e.key==='ArrowDown') {
		player.dy = 5;
		player.animate.frames = [0];
	}
};

const onKeyUp = e => {
	let player = DataStore.getValue('data','Sprite','player');
	if ( ! player) return;
	player.dx = 0; player.dy = 0;
	player.animate.frames = [0,1,2,3,4,5,6,7];
};

const GamePage = () => {
	
	let stage = DataStore.getValue('data','Stage','main');
	if ( ! stage) {
		let player = Player.make({name:"Dan", x:10, y:10, src:'/img/obi-wan-kenobi.png',
			height:127, width:70,
			frames:['-3px -4px', '-94px -4px', '-186px -4px', '-273px -4px', 
				'-360px -4px', '-456px -4px', '-550px -4px', '-637px -4px'],
			animate: {frames:[0,1,2,3,4,5,6,7], dt:200}
		});
		DataStore.setValue(['data', 'Sprite', 'player'], player);

		stage = Stage.make();
		Stage.addSprite(stage, player);
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
