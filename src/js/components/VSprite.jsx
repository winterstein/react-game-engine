
import React from 'react';
import { assert, assMatch } from 'sjtest';
import {getType} from '../base/data/DataClass';
import Sprite from '../data/Sprite';
import Snake from '../data/Snake';
import GameControls from '../GameControls';
import {DropZone} from '../base/components/DragDrop';
import CanvasComponent from './CanvasComponent';

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
	let b = rect.y + sprite.height;
	if ( ! b) b = 0; // avoid NaN
	let zIndex = 1000 + Math.round(b); // layer by high-y = first
	// under-foot floor tiles
	if (sprite.zIndex < 0) zIndex -= 1000;

	let frameOffset = sprite.frames? sprite.frames[sprite.frame || 0] : 0+' '+0;
	let style = {position:'absolute', overflow:'hidden', 
		top, left, zIndex, width, height,
		border: sprite.selected? 'solid 2px yellow' : 'solid 2px black' // TODO add an isometric selected base with lower z-index
	};
	// canvas
	let img;
	if (sprite.canvas) {
		img = <CanvasComponent width={rect.width} height={rect.height} render={ctx => Snake.render(sprite, ctx)} />;
	} else {
		let offLeft = 0, offTop = 0; // rect.x, top = rect.y;
		if (frameOffset) {
			offLeft = frameOffset[0];
			offTop = frameOffset[1];
			// let r = frameOffset[2] || l+rect.width, b = frameOffset[3] || t+rect.height;
			// imgStyle.clip = "rect(" + [t, r, b, l].join(',') +")";
		}
		let imgStyle = {
			position:'absolute', overflow:'hidden',
  			// width: rect.width+'px', 
			// maxHeight: rect.height+'px',
			transform: `translate(-${offLeft}px, -${offTop}px)`,
      		imageRendering: 'crisp-edges',
		};
		// style.transform = `scale(${this.props.scale || this.context.scale})`;
      	// transformOrigin: 'top left',
		// clip is rect(top, right, bottom left)!		
		img = <img src={sprite.src} style={imgStyle} />
	}
	let S = <div title={getType(sprite)+' '+sprite.id} 
		style={style} onClick={e => GameControls.select({sprite})}
		>{img}</div>;
	// debug {Math.round(sprite.x)} {Math.round(sprite.y)}
	
	if (sprite.dropzone) {
		return <DropZone id={sprite.id}>{S}</DropZone>;
	}
	return S;
};

export default VSprite;
