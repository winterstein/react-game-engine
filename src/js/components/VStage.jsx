
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
	let tick = Game.tick;
	// dropzone on tiles
	return (<div className='VStage container-fluid'>
		<div className='VWorld'>
			{stage.sprites.map(s => <VSprite key={s.id} sprite={s} tick={tick} />)}
		</div>
		<Cards />
</div>);
};

const Cards = () => {
	let cards = [Card.make({id:'wall'}), Card.make({id:'fly-swatter'})];
	return (<div className='VCards row'>
		{cards.map(c => <div className='col-sm' key={c.id}><VCard card={c} /></div>)}
	</div>);
};

const VCard = ({card}) => {
	return <Draggable id={card.id}><div className='card'>{JSON.stringify(card)}</div></Draggable>;
};

export default VStage;
