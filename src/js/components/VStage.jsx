
import React from 'react';
import BS from '../base/components/BS';
import Misc from '../base/components/Misc';
import { assert, assMatch } from 'sjtest';
import {getType} from '../base/data/DataClass';
import Sprite from '../data/Sprite';
import Stage from '../data/Stage';
import Card from '../data/Card';
import Grid from '../data/Grid';
import VSprite from './VSprite';
import DataStore from '../base/plumbing/DataStore';
import CanvasComponent from './CanvasComponent';
import Game from '../Game';
import {DropZone, Draggable, dragstate} from '../base/components/DragDrop';
import ChunkyButton from './ChunkyButton';
import StopWatch from '../StopWatch';
import Tile from '../data/Tile';

let lastRender = new Date();


const VStage = ({stage}) => {
	const now = new Date();
	const dt = now.getTime() - lastRender.getTime();
	let fps = 1000/dt;
	lastRender = now;
	// console.log("draw VStage");
	// dropzone on tiles
	const grid = stage.grid;
	let drawGrid = ctx => {		
		ctx.clearRect(0,0,grid.screenWidth,grid.screenHeight);
		ctx.strokeStyle = "#333";
		ctx.font = "10px Arial";
		for(let tx=0; tx<grid.width; tx++) {
			for(let ty=0; ty<grid.height; ty++) {
				let s1 = Grid.screenFromGame({x:tx, y:ty});
				let s2 = Grid.screenFromGame({x:tx+1, y:ty});
				let s3 = Grid.screenFromGame({x:tx, y:ty+1});
				let s4 = Grid.screenFromGame({x:tx+1, y:ty+1});
				ctx.beginPath();
				ctx.moveTo(s1.x, s1.y);
				ctx.lineTo(s2.x, s2.y);
				ctx.lineTo(s4.x, s4.y);
				ctx.lineTo(s3.x, s3.y);
				ctx.lineTo(s1.x, s1.y);
				ctx.closePath();
				ctx.stroke();				
				ctx.fillText(tx+", "+ty, s1.x+1, s1.y+12);
			}
		}
	};

	const height = grid.height*grid.tileHeight;

	const bgSprite = stage.backgroundImage? new Tile({src: stage.backgroundImage, x:0, y:0, width:grid.width, height:grid.height}) : null;
	const game = Game.get();

	return (<div className='VStage container-fluid'>
		<div className='VWorld'>			
			<CanvasComponent id='VStage' width={1000} height={height}
				render={ctx => {/* hm? */}}>
				<VGrid render={ctx => drawGrid(ctx)} />
				{bgSprite? <VSprite sprite={bgSprite} /> : null}
			</CanvasComponent>
			{stage.sprites.map(s => <VSprite key={s.id} sprite={s} />)}
		</div>
		<Cards />
		<UI stage={stage} />
		<div className='debug'>
		</div>
	</div>);			
};

/**
 * Hm - can we put a render on this?
 */
const VGrid = () => {
	return <></>; //null; //
};

const UI = ({stage}) => {
	let players = Game.get().players;
	// {players.map(plyr => <ChunkyButton key={plyr.id} player={plyr} 
	// 	onClick={ e => Sprite.addCommand(plyr, {name:'fire'}) } />)}
	return (<div className='VUI' >
		<PauseButton />
	</div>);
};

const PauseButton = () => {
	const sw = Game.get().ticker;
	let style = {
		position: 'fixed',
		zIndex:10000,
		top: '1vh',
		right: '1vw'
	};
	if (sw.paused) {
		return <BS.Button style={style} color='primary' onClick={e => StopWatch.start(sw)}><Misc.Icon fa='play' />go</BS.Button>;
	}
	return <BS.Button style={style} color='primary' onClick={e => StopWatch.pause(sw)}><Misc.Icon fa='pause' />pause</BS.Button>;
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
