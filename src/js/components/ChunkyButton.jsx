
import React from 'react';
import ReactDOM from 'react-dom';

const ChunkyButton = ({player, onClick}) => {
	let players = Game.get().players;
	let pi = players.indexOf(player);
	let style = {
		position: 'fixed',
		zIndex:10000,
		width: '5vw',
		height: '5vw',
		borderRadius: '2.5vw',
	};
	if (pi) {
		style.bottom = '10px';
		style.right = '10px';
	} else {
		style.top = '10px';
		style.left = '10px';
	}
	return (
<button style={style} className='btn btn-primary btn-xlg' onClick={onClick}> {pi} </button>
	);
}

export default ChunkyButton;
