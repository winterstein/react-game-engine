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
import FrogGame from '../FrogGame';
import GameControls from '../GameControls';
import MultiplayerPage from './MultiplayerPage';

const FrogGamePage = () => {
	const game = Game.get();

	// let stage = Game.getStage(game);
	// if ( ! stage) {
	// 	stage = new Stage({id:'PickPlayers'});
	// 	Game.setStage(game, stage);		
	// }
	// if (stage.id==='PickPlayers') {
	// 	if ( ! stage.done) {
	// 		return <MultiplayerPage />;
	// 	}
	// }	
	// The game itself :)
	FrogGame.init();
	let stage = Game.getStage(game);
		// return <Misc.Loading />
	Stage.start(stage, game);

		// onLoad={() => this.refs.item.focus()}

	// NB tabIndex needed for onKeyDown to work
	return (<div tabIndex="1" className='GamePage'
		onClick={e => DataStore.update()} >
		<VStage stage={stage} />
	</div>);

};

export default FrogGamePage;
