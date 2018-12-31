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

	let player = Player.make({name:"Dan", x:1, y:1});
	let stage = Stage.make();
	Stage.addSprite(player);

	return (<div className='GamePage'>
		{Player.str(player)}
		<pre>{JSON.stringify(player)}</pre>
		<pre>Sprite.isa(player)</pre>
		<VStage stage={stage} />
	</div>);

};

export default GamePage;
