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

const GamePage = () => {
	let path = ['widget', 'TestPage'];
	let widget = DataStore.getValue(path) || {};

	let stage = DataStore.getValue('data','stage');
	if ( ! stage) {
		let player = Player.make({name:"Dan", x:10, y:10, src:'/img/obi-wan-kenobi.png',
			height:127, width:70,
			frames:['-3px -4px', '-94px -4px', '-186px -4px', '-273px -4px', 
				'-360px -4px', '-456px -4px', '-550px -4px', '-637px -4px'],
			animate: {frames:[0,1,2,3,4,5,6,7], dt:200}
		});

		stage = Stage.make();
		Stage.addSprite(stage, player);
		DataStore.setValue(['data', 'stage'], stage);
	}

	return (<div className='GamePage' onClick={e => DataStore.update()}>
		<VStage stage={stage} />
	</div>);

};

export default GamePage;
