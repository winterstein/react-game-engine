/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import C from '../C';
import Game, { doLoad, doSave, doReset } from '../Game';
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
import { Alert, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getPApp } from './Pixies';
import { nonce } from '../base/data/DataClass';
import {getPeerId, doJoin, startAudioCall, getConnections} from '../plumbing/peering';

/**
 * @param {String} world
 */
const GameAdmin = ({world}) => {
	// pause game
	const showAdmin = DataStore.getShow('admin');	
	let ticker = Game.get().ticker;
	if (showAdmin && ! ticker.paused) StopWatch.pause(ticker);
	if ( ! showAdmin && ticker.paused) StopWatch.start(ticker);

	const toggle = () => DataStore.setShow('admin', ! showAdmin);
	let conns = _.flatten(Object.values(getConnections()));

	return (<>
		<div style={{position:'fixed',top:0,right:'1vh',color:'#ccc',fontSize:'16pt'}} onClick={() => DataStore.setShow('admin', true)}>&#x2699;</div>
		<Modal isOpen={showAdmin}
			className="login-modal"
			toggle={toggle}
		>
			<ModalHeader toggle={toggle}>
				<Misc.Logo url={C.app.logo} transparent={false} className='pull-left m-r1' />{' '}{C.app.name}
			</ModalHeader>
			<ModalBody>							
				<div className='container'>
					<h4>This Device is known as: 
						<a 
							data-sharetext='Join my goose' data-sharetitle='Join my goose'
							href={window.location+'&join='+getPeerId()} 
							onClick={e => doShare(e, this)}
						>{getPeerId()}</a>
					</h4>
					<h4>This World is known as: {world} {Game.get().id}</h4>
					<div><Button onClick={() => doSave(Game.get())}>Save World</Button></div>
					<div><Button onClick={doNewWorld}>New World</Button></div>
					<div><Button onClick={doLoadWorld}>Load World</Button></div>
					<div className='form-inline'>
						<PropControl prop='join' path={['widget','admin']} />
						<Button onClick={doJoinWorld}>Join a Friends World</Button>
					</div>
					{conns.map((c,i) => <ConnectionInfo key={i} connection={c} />)}
					<button onClick={startAudioCall}>Call</button>
				</div>
			</ModalBody>
		</Modal></>);
};


const ConnectionInfo = ({connection}) => {
	console.log("connection", connection);
	return <div>Open: {""+connection.open} {JSON.stringify(connection.metadata)}</div>;
};


const doNewWorld = () => {
	doReset();
	const game = Game.get();
	Game.init(game);
	// host+world
	game.id = getPeerId()+'-'+nonce(4);
	let world = game.id;
	DataStore.setUrlValue("world", world);
	DataStore.setShow('admin', false);
};

const doLoadWorld = () => {
	let game = doLoad();
	Game.init(game);
	let world = game.id;
	DataStore.setUrlValue("world", world);
	DataStore.setShow('admin', false);	
};


/**
 * 
 * @param {React.MouseEvent} e 
 * @param {*} $a 
 */
const doShare = (e,$a) => {
	if (navigator.share) {
		let shareUrl = $a.getAttribute('href');
		let shareTitle = $a.getAttribute('data-sharetitle');
		let shareText = $a.getAttribute('data-sharetext');
		navigator.share({url:shareUrl,title:shareTitle,text:shareText});
		e.stopPropagation();
		e.preventDefault();
	}
};

const doJoinWorld = () => {
	let world = DataStore.getValue('widget','admin','join');
	if ( ! world) return;
	DataStore.setUrlValue('world', world);
	DataStore.setShow('admin', false);
};

export {
	doNewWorld
};
export default GameAdmin;
