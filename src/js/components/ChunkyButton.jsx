
import React from 'react';
import ReactDOM from 'react-dom';

const ChunkyButton = ({player, onClick}) => {
	let players = Game.get().players;
	let pi = players.indexOf(player);
	let style = {
		position: 'fixed',
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
