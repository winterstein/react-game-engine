import React, { useState } from 'react';
import Game from '../Game';
import { space } from '../base/utils/miscutils';


const LeftNav = ({className}) => {
	const game = Game.get();
	const player = Game.getPlayer() || null;
	const inventory = Game.getInventory(Game.get());
	return (<div className={space('leftnav m-0',className,'text-white')} 
		style={{height:'100%',width:'150px', 
			backgroundImage:'url(/img/src/bg/blackboard-texture.jpg)', backgroundColor:'#222', backgroundSize:'cover'
		}}>
		<div><a href='#story'>Story</a></div>
		<div><a href='#explore'>Explore</a></div>
		<div><a href='#fight'>Fight</a></div>

		<div>People</div>

		<div>Places</div>

		<div>Inventory</div>
		{Object.keys(inventory).map(i => JSON.stringify(i))}
	</div>);
};
export default LeftNav;
