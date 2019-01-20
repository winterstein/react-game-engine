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
import MultiplayerGame from '../MultiplayerGame';

const MultiplayerPage = () => {
	let stage = Game.getStage();
	if ( ! stage) {
		MultiplayerGame.init();
		return <Misc.Loading />
	}

	let players = [{name:"A", color:'red', top:0, left:0}, {name:"B", color:'blue', bottom:0, right:0}];

	// NB tabIndex needed for onKeyDown to work
	let w = DataStore.getValue('env','width');
	let h = DataStore.getValue('env','height');
	return (<div style={{width:'100%', height:'100%'}}>
		<VStage stage={stage} width={w} height={h} />
		{players.map(p => <Controls key={p.id || p.name} player={p} />)}
	</div>);
};

const doThrow = ({player}) => {
	// TODO do we have anything to throw?
	let stage = Game.getStage();
	let game = Game.get();
	let sprite = game.sprites.duck;
	// spawn - ie copy and add
	sprite = {...sprite};
	Stage.addSprite(stage, sprite);
};

const Controls = ({player}) => {
	let style = {
		position:'absolute', 
		top:player.top, left:player.left, right:player.right, bottom:player.bottom,
		border:'solid 1px '+player.color
	};
	return (
		<div style={style}>
			<div>heart</div>
			<button>Next</button>
			<button className='btn-big-round' onClick={e => doThrow({player})}>Throw</button>
		</div>
	);
};
export default MultiplayerPage;
