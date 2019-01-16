
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
	// console.log("draw VStage");
	// dropzone on tiles
	let drawGrid = ctx => {
		// stage.width and 
		for(let tx=0; tx<10; tx++) {
			for(let ty=0; ty<10; ty++) {
				let gx = tx*tw, gy = ty*th;				
				let s = Grid.screenFromGame(gx, gy, 0);
				ctx.beginPath();
				ctx.moveTo(, 0);
				ctx.lineTo(300, 150);
				ctx.stroke();
			}
		}
	};

	return (<div className='VStage container-fluid'>
		<div className='VWorld'>
			<CanvasComponent width={'100%'} height={'100%'} 
				render={ctx => drawGrid(ctx)} />;
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
	let style = {
		minHeight:'200px',
		backgroundColor: 'cornsilk'
	};
	return <Draggable id={card.id}><div className='well card' style={style}>
		{card.name || card.id}
		{card.sprite? <VSprite sprite={card.sprite} /> : null}
		</div></Draggable>;
};

export default VStage;
