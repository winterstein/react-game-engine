
import React from 'react';
import { assert, assMatch } from 'sjtest';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import VSprite from './VSprite';
import DataStore from '../base/plumbing/DataStore';

let updater = null;

const VStage = ({stage}) => {
	if ( ! updater) {
		updater = setInterval(() => { DataStore.update(); }, 50); // 20fps
	}
	let tick = new Date().getTime(); // TODO
	return <div className='VStage'>{stage.sprites.map(s => <VSprite key={s.id} sprite={s} tick={tick} />)}</div>;
};

export default VStage;
