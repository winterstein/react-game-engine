import React, { useState } from 'react';
import Game from '../Game';


const LeftNav = () => {
	const game = Game.get();
	const player = Game.getPlayer() || null;
	const inventory = (player && player.inventory) || [];
	return (<div>
		<div><a href='#story'>Story</a></div>
		<div><a href='#explore'>Explore</a></div>
		<div><a href='#fight'>Fight</a></div>

		People

		Places

		Inventory
		{inventory.map(i => JSON.stringify(i))}
	</div>);
};
export default LeftNav;
