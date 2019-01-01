
import React from 'react';
import { assert, assMatch } from 'sjtest';
import Sprite from '../data/Sprite';

const VSprite = ({sprite, tick}) => {
	let top = sprite.y+'px';
	let left = sprite.x+'px';
	let width = sprite.width+'px';
	let height= sprite.height+'px';
	let zIndex = 100 + 1; // TODO layers
	// TODO frames
	if (sprite.animate) {
		let tocks = Math.floor(tick / sprite.animate.dt);
		const i = tocks % sprite.animate.frames.length;
		sprite.frame = sprite.animate.frames[i];
	}
	let frameOffset = sprite.frame && sprite.frames? sprite.frames[sprite.frame] : 0+' '+0;
	let style = {position:'absolute', overflow:'hidden', 
		top, left, zIndex, width, height,
		backgroundImage: "url('"+sprite.src+"')",
		backgroundPosition: frameOffset,
		backgroundRepeat: 'no-repeat'
	};	
	// TODO clip from sprite sheet
	return <div style={style}></div>;
};

export default VSprite;
