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
import MyGame from '../MyGame';

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
		MyGame.init();
		return <Misc.Loading />
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
