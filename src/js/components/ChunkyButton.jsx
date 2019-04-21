
import React from 'react';
import ReactDOM from 'react-dom';

const ChunkyButton = ({player, onClick}) => {
	let players = Game.get().players;
	let pi = players.indexOf(player);
	let style = {
		position: 'fixed',
		zIndex:10000,
		width: '10vw',
		height: '10vw',
		borderRadius: '5vw',
	};
	if (pi) {
		style.bottom = '-1vw';
		style.right = '-1vw';
	} else {
		style.top = '-1vw';
		style.left = '-1vw';
	}
	return (
<button style={style} className='btn btn-primary btn-xlg' 
	onClick={onClick}
	onTouchStart={e => console.log("onTouchStart",e)}
	onTouchMove={e => console.log("onTouchMove",e)}
	> {pi} </button>
	);
}

export default ChunkyButton;
