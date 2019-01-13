
import React from 'react';
import { assert, assMatch } from 'sjtest';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import Card from '../data/Card';
import VSprite from './VSprite';
import DataStore from '../base/plumbing/DataStore';
import Game from '../Game';
import {DropZone, Draggable, dragstate} from '../base/components/DragDrop';

const VStage = ({stage}) => {
	console.log("draw VStage");
	// dropzone on tiles
	return (<div className='VStage container-fluid'>
		<div className='VWorld'>
			{stage.sprites.map(s => <VSprite key={s.id} sprite={s} />)}
			<canvas />
		</div>
		<Cards />
</div>);
};

const Cards = () => {
	let cards = DataStore.getValue('data', 'Game', 'cards') || [];
	return (<div className='VCards row'>
		{cards.map(c => <div className='col-sm-2' key={c.id}><VCard card={c} /></div>)}
	</div>);
};

const VCard = ({card}) => {
	return <Draggable id={card.id}><div className='well card'>
		{card.sprite? <VSprite sprite={card.sprite} /> : null}
		{JSON.stringify(card)}</div></Draggable>;
};

export default VStage;
