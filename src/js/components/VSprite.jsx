
import React from 'react';
import { assert, assMatch } from 'sjtest';
import Sprite from '../data/Sprite';

const VSprite = ({sprite, tick}) => {
	let onClick = e => {
		sprite.selected = true;
	};
	let top = (sprite.y)+'px';
	let left = (sprite.x)+'px'; // isometric mix x-y??
	let width = sprite.width+'px';
	let height= sprite.height+'px';
	const b = sprite.y + sprite.height;
	let zIndex = 1000 + Math.round(b); // layer by high-y = first
	// under-foot floor tiles
	if (sprite.zIndex < 0) zIndex -= 1000;

	let frameOffset = sprite.frame && sprite.frames? sprite.frames[sprite.frame] : 0+' '+0;
	let style = {position:'absolute', overflow:'hidden', 
		top, left, zIndex, width, height,
		backgroundImage: "url('"+sprite.src+"')",
		backgroundPosition: frameOffset,
		backgroundRepeat: 'no-repeat',
		border: sprite.selected? 'solid 2px yellow' : null // TODO add an isometric selected base with lower z-index
	};	
	// TODO clip from sprite sheet
	return <div style={style} onClick={onClick}></div>;
};

export default VSprite;
