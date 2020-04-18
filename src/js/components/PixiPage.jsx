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
import { Alert } from 'reactstrap';
import { getPApp } from './Pixies';

const PixiPage = () => {

	const game = Game.get();
	Game.init(game);
	const papp = getPApp();

	return (<div style={{position:'relative', userSelect:"none"}}>
		<div className='portrait'>
			<Alert color='warning'>Please rotate your phone to landscape. Then reload this page.</Alert>
		</div>
		<PixiComponent app={papp} />
	</div>);
};


export default PixiPage;
