
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
	return (<div className='VStage'>
		<DropZone id='garden' onDrop={(e,drop) => {
			console.log("dropp",e,drop);
			if ( ! drop.draggable) return;
			let s = null; //getSprite(drop.draggable);
			if (s) {
				s.active = true;
				s.x = drop.x; s.y = drop.y;
			}
		}}>
			<div className='VWorld'>
				{stage.sprites.map(s => <VSprite key={s.id} sprite={s} tick={tick} />)}
			</div>
		</DropZone>
		<Cards />
</div>);
};

const Cards = () => {
	let cards = [Card.make({id:'wall'}), Card.make({id:'fly-swatter'})];
	return (<div className='VCards'>
		{cards.map(c => <VCard key={c.id} card={c} />)}
	</div>);
};

const VCard = ({card}) => {
	return <Draggable id={card.id}><div className='well'>{JSON.stringify(card)}</div></Draggable>;
};

export default VStage;
