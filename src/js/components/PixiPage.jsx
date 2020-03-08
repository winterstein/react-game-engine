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
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';

const PixiPage = () => {
	return (<div style={{position:'relative'}}>
		<PixiComponent />
		<div style={{cursor:'pointer',fontSize:'300%',position:'absolute',bottom:'20px',left:'20px',color:'red'}} onClick={e => console.warn(e)}>&#x25B2;</div>
	</div>);
};

export default PixiPage;
