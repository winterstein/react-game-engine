import React, { useState } from 'react';
import Game from '../Game';
import { getUrlVars, space } from '../base/utils/miscutils';


const LeftNav = ({className}) => {
	const game = Game.get();
	const player = Game.getPlayer() || null;
	const inventory = Game.getInventory(Game.get());
	const cast = Game.get().cast || {};
	const places = Game.get().places || {};
	let all = getUrlVars()["all"];
	return (<div className={space('leftnav m-0',className,'text-white')} 
		style={{height:'100%',width:'150px'}} >
		<h3><a href='#story'>Story</a></h3>
		{all && <h4><a href='#story?chapter=benj-ptang1'>Benj &amp; PTang</a></h4>}
		{all && <h3><a href='#story?chapter=chapter-test'>Test Fragment</a></h3>}
		{all && <h3><a href='#explore'>Explore</a></h3>}
		{all && <h3><a href='#fight'>Arena</a></h3>}

		<h3>People</h3>
		{Object.keys(cast).map(n => <div key={n}>{n}</div>)}

		<h3>Places</h3>
		{Object.keys(places).map(n => <div key={n}>{n}</div>)}

		<h3>Inventory</h3>
		{Object.keys(inventory).map(i => <div key={i}>{i}</div>)}
	</div>);
};
export default LeftNav;
