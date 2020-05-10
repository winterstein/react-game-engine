/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore, { getValue, setValue } from '../base/plumbing/DataStore';
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
import { Alert, Button, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Container, Form, CardTitle } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce } from '../base/data/DataClass';
import {Room,getPeerId} from '../plumbing/peering';
import Wizard, { WizardStage } from '../base/components/WizardProgressWidget';
import { stopEvent } from '../base/utils/miscutils';

// Game states: Name -> Create / Join -> Start -> Enter -> Deliver stories


/**
 * @param {String} world
 */
const ConsequencesGame = ({room}) => {	
	let myId = getPeerId();
	const statePath = ['data','Room',room.id,'state'];
	
	let myAnswersPath = statePath.concat(['answers', myId]);
	let myAnswers = getValue(myAnswersPath);

	return (<div>
		<h2>Consequences Game</h2>
		
		<div>
			<PropControl label='He said' path={myAnswersPath} prop={0} />
		</div>

		TODO
	</div>);		
};

export default ConsequencesGame;
