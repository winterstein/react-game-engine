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
import GameControls from '../GameControls';

const GamePage = () => {
	
	let stage = Game.getStage();
	if ( ! stage) {
		MyGame.init();		
		return <Misc.Loading />
	}
	Stage.start(stage, Game.get());

		// onLoad={() => this.refs.item.focus()}

	// NB tabIndex needed for onKeyDown to work
	return (<div tabIndex="1" className='GamePage'
		onClick={e => DataStore.update()} 
		onKeyDown={GameControls.onKeyDown}
		onKeyUp={GameControls.onKeyUp} 
	>
		<VStage stage={stage} />
	</div>);

};

export default GamePage;
