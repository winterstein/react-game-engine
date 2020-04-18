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
import Game, { doLoad } from '../Game';
import _setup from '../game-setup';
import _update from '../game-update';
import Misc from '../base/components/Misc';
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import PropControl, { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from '../Key';
import { Alert, Button } from 'reactstrap';
import { getPApp } from './Pixies';

const doNewWorld = () => {
	const game = Game.get();
	Game.init(game);
	let world = game.id;
	DataStore.setUrlValue("world", world);
	Game.setAutoSave(true);
};

const doLoadWorld = () => {
	let game = doLoad();
	Game.init(game);
	let world = game.id;
	DataStore.setUrlValue("world", world);
	Game.setAutoSave(true);
};

const PixiPage = () => {
	const world = DataStore.getUrlValue("world");
	const inGame = !! world;

	// check it has been loaded / inited
	let papp;
	if (inGame) {
		papp = getPApp();
		if ( ! papp) {
			let game = doLoad(world);
			Game.init(game);
			Game.setAutoSave(true);
			papp = getPApp();
			assert(papp);
		}
	}

	return (<div style={{position:'relative', userSelect:"none"}}>
		<div className='portrait'>
			<Alert color='warning'>Please rotate your phone to landscape. Then reload this page.</Alert>
		</div>
		{inGame? <PixiComponent app={papp} /> : <GameAdmin/> }
	</div>);
};

const GameAdmin = () => {
	return (<div>
		<div><Button onClick={doNewWorld}>New World</Button></div>
		<div><Button onClick={doLoadWorld}>Load World</Button></div>
		<div><PropControl prop='world' /><Button>Join World</Button></div>
	</div>);
};


export default PixiPage;
