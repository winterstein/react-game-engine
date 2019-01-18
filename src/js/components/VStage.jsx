
import React from 'react';
import { assert, assMatch } from 'sjtest';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import Card from '../data/Card';
import Grid from '../data/Grid';
import VSprite from './VSprite';
import DataStore from '../base/plumbing/DataStore';
import CanvasComponent from './CanvasComponent';
import Game from '../Game';
import {DropZone, Draggable, dragstate} from '../base/components/DragDrop';

const VStage = ({stage}) => {
	// console.log("draw VStage");
	// dropzone on tiles
	let tw = Grid.tileWidth; let th= Grid.tileHeight;
	let drawGrid = ctx => {

		ctx.beginPath();
		ctx.moveTo(10, 10);
		ctx.lineTo(10, 20);
		ctx.lineTo(20, 20);
		ctx.lineTo(20, 10);
		ctx.closePath();
		ctx.fillStyle='#ff0000';
		ctx.fill();

		// stage.width and 
		ctx.strokeStyle = "#333";
		// (stage.width/tx)
		for(let tx=0; tx<5; tx++) {
			for(let ty=0; ty<5; ty++) {
				let gx = tx*tw, gy = ty*th;
				let gx2 = gx+tw, gy2 = gy+th;
				let s1 = Grid.screenFromGame(gx, gy, 0);
				let s2 = Grid.screenFromGame(gx2, gy, 0);
				let s3 = Grid.screenFromGame(gx, gy2, 0);
				let s4 = Grid.screenFromGame(gx2, gy2, 0);
				ctx.beginPath();
				ctx.moveTo(s1.x, s1.y);
				ctx.lineTo(s2.x, s2.y);
				ctx.lineTo(s4.x, s4.y);
				ctx.lineTo(s3.x, s3.y);
				ctx.lineTo(s1.x, s1.y);
				ctx.closePath();
				ctx.stroke();
				console.log(tx, ty, s1,s4);
			}
		}
	};

// {stage.sprites.map(s => <VSprite key={s.id} sprite={s} />)}
	return (<div className='VStage container-fluid'>
		<div className='VWorld'>
			<CanvasComponent width={500} height={500} 
				render={ctx => drawGrid(ctx)} />
		</div>
		<Cards />
</div>);
};

const Cards = () => {
	if (true) return null;
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
