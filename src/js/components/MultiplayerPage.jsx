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
import VSprite from './VSprite';

const MultiplayerPage = () => {
	let game = Game.get();
	if ( ! game.players || game.players.length===0) {
		_.defer(
			() => Game.setPlayers(game, [new Player({name:"Player 1"})])
		);
		return null;
	}
	return (<div>
		<h2>Number of Players</h2>
		{game.players.map(p => <div key={p.id}>{p.id} {p.name}</div>)}
		<button className='btn btn-default'
			onClick={
				e => Game.setPlayers(game, game.players.concat(
						new Player({name:"Player "+(1+game.players.length)})
						))
			} >
			Add Player
		</button>
		<div><a className='btn btn-primary' href='#game'>GO!</a></div>
	</div>);
};

export default MultiplayerPage;
