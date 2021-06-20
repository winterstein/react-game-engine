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
import _setup from '../game-setup';
import _update from '../game-update';
import Misc from '../base/components/Misc';
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from '../Key';

const PixiPage = () => {

	const game = Game.get();
	Game.init(game);

	return (<div style={{position:'relative', userSelect:"none"}}>
		<PixiComponent app={game.app} />
		<ArrowPad game={game} />		
	</div>);
};

const ArrowPad = ({game}) => {
	return <div style={{position:'absolute',bottom:'100px',left:'50px',color:'red'}}>
		<center><Arrow dirn='up' game={game} /></center>
		<div><Arrow dirn='left' game={game} /> &nbsp;&nbsp; <Arrow dirn='right' game={game} /></div>
		<center><Arrow dirn='down' game={game} /></center>
	</div>
		
};
const Arrow = ({dirn, game}) => {
	let c = {
		up: '&#x25B2;',
		left: '&#x25C0', right: '&#x25B6',
		down: "&#x25BC"
	};

	// onMouseDown={ e => Game.handleInput({input:dirn, on:true}) }
	// onMouseUp={ e => {console.log(e); Game.handleInput({input:dirn, on:false});} }  
	// onMouseOut={ e => {console.log(e); Game.handleInput({input:dirn, on:false});} }  

	// onClick={ e => Game.handleInput({input:dirn, on:true}) } 
	return <span style={{cursor:'pointer',fontSize:'300%'}} 
		onTouchStart={ e => Game.handleInput({input:dirn, on:true}) }
		onTouchCancel={ e => {console.log(e); Game.handleInput({input:dirn, on:false});} }  
		onTouchEnd={ e => {console.log(e); Game.handleInput({input:dirn, on:false});} }  

		dangerouslySetInnerHTML={{__html:c[dirn]}}></span>;
}

export default PixiPage;
