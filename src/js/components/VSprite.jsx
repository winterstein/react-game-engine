
import React from 'react';
import { assert, assMatch } from 'sjtest';
import {getType} from '../base/data/DataClass';
import Sprite from '../data/Sprite';
import GameControls from '../GameControls';
import {DropZone} from '../base/components/DragDrop';

// See https://github.com/FormidableLabs/react-game-kit/blob/master/src/components/sprite.js
// img transform: `translate(-${left}px, -${top}px)`,
// div transform  transform: `scale(${this.props.scale || this.context.scale})`,
    //   transformOrigin: 'top left',
    //   imageRendering: 'pixelated',

const VSprite = ({sprite, tick}) => {
	let rect = Sprite.screenRect(sprite);
	let top = rect.y+'px';
	let left = rect.x+'px';
	let width = rect.width+'px';
	let height= rect.height+'px';
	const b = rect.y + sprite.height;
	let zIndex = 1000 + Math.round(b); // layer by high-y = first
	// under-foot floor tiles
	if (sprite.zIndex < 0) zIndex -= 1000;

	let frameOffset = sprite.frames? sprite.frames[sprite.frame || 0] : 0+' '+0;
	let style = {position:'absolute', overflow:'hidden', 
		top, left, zIndex, width, height,
		backgroundImage: "url('"+sprite.src+"')",
		backgroundPosition: frameOffset,
		backgroundRepeat: 'no-repeat',
		border: sprite.selected? 'solid 2px yellow' : 'solid 2px black' // TODO add an isometric selected base with lower z-index
	};
	// debug {Math.round(sprite.x)} {Math.round(sprite.y)}
	let S = <div title={getType(sprite)+' '+sprite.id} style={style} onClick={e => GameControls.select({sprite})}></div>;
	if (sprite.dropzone) {
		return <DropZone id={sprite.id}>{S}</DropZone>;
	}
	return S;
};

export default VSprite;
