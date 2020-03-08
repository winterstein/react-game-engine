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
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
import Key, {KEYS} from '../Key';

const makePixiSprite = spriteSpec => {
	let sprite = new PIXI.Sprite(app.loader.resources[spriteSpec.src].texture);
	sprite.texture.frame = new PIXI.Rectangle(0,0,48,48);
	return sprite;
};

const setupAfterLoad = () => {
	const game = Game.get();
	const world = new PIXI.Container();
	app.stage.addChild(world);

	let sprite = makePixiSprite(SpriteLib.goat());
	world.addChild(sprite);

	let bsprite = new PIXI.Sprite(app.loader.resources["/img/animals.TP.json"].textures['bunny/bunny-0.png']);
	app.stage.addChild(bsprite);
	bsprite.dx = 0;

	let right = new Key(KEYS.ArrowRight);
	let left = new Key(KEYS.ArrowLeft);

	right.press = () => bsprite.dx = 1;
	right.release = () => left.isUp? bsprite.dx = 0 : null;
	
	left.press = () => bsprite.dx = -1;
	left.release = () => right.isUp? bsprite.dx = 0 : null;
};

const PixiPage = () => {
	
	const game = Game.get();
	Game.init(game);

	if ( ! game.app) {
		game.app = new PIXI.Application(window.innerWidth, window.innerHeight);
		window.app = game.app;
		app.loader
		.add("/img/animals.TP.json")
		.add(SpriteLib.alligator().src)
		.add(SpriteLib.goat().src)
  		.load(setupAfterLoad);
	}
	
	return (<div style={{position:'relative'}}>
		<PixiComponent app={game.app} />
		<div style={{cursor:'pointer',fontSize:'300%',position:'absolute',bottom:'20px',left:'20px',color:'red'}} onClick={e => console.warn(e)}>&#x25B2;</div>
	</div>);
};

export default PixiPage;
