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

const PixiPage = () => {
	let type = "WebGL"
	if( ! PIXI.utils.isWebGLSupported()){
		type = "canvas"
	}
	PIXI.utils.sayHello(type);
	
	//Create a Pixi Application
	let app = new PIXI.Application({width: 256, height: 256});


	return (<div>
		{app.view}
	</div>);
};