
import React from 'react';
import { assert, assMatch } from 'sjtest';
import {getType} from '../base/data/DataClass';
import Sprite from '../data/Sprite';
import Snake from '../data/Snake';
import GameControls from '../GameControls';
import {DropZone} from '../base/components/DragDrop';
import CanvasComponent from './CanvasComponent';
import Sound from 'react-sound';

// See https://github.com/FormidableLabs/react-game-kit/blob/master/src/components/sprite.js
// img transform: `translate(-${left}px, -${top}px)`,
// div transform  transform: `scale(${this.props.scale || this.context.scale})`,
    //   transformOrigin: 'top left',
    //   imageRendering: 'pixelated',

/**
 * @param {object} obj
 * @param {!Sprite} obj.sprite
 */
const VSprite = ({sprite}) => {
	Sprite.assIsa(sprite);
	if (sprite.hidden || sprite.loading) {
		return null;
	}
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

	// animation frame
	let frameOffset = [0,0];
	if (sprite.frame !== undefined) {
		if ( ! sprite.frames) {
			console.warn("VSprite.jsx frame without frames - call Sprite.initFrames() early", sprite);
		} else {
			frameOffset = sprite.frames[sprite.frame || 0];
		}
	}	

	let style = {position:'absolute', overflow:'hidden', 
		top, left, zIndex, width, height,
		border: sprite.selected? 'solid 2px yellow' : null,
		// transform: 'scaleY(-1)' flip upside down?
		// TODO add an isometric selected base with lower z-index
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
			transformOrigin: "0 0",
      		imageRendering: 'crisp-edges',
		};
		if (sprite.tileSize) {
			let scale = rect.width / sprite.tileSize[0];
			if (scale) imgStyle.transform = "scale("+scale+") "+imgStyle.transform;
		} else if ( ! sprite.frames) {
			// set tileSize = the whole image, so we can do scaling
			let _img = new Image();
			_img.onload = () => {
				sprite.tileSize = [_img.naturalWidth, _img.naturalHeight];
			};
			_img.src = sprite.src;			
		}
      	// transformOrigin: 'top left',
		// clip is rect(top, right, bottom left)!		
		img = <img src={sprite.src} style={imgStyle} />
	}
	// sound
	let snd = null;
	if (false && sprite.sound) {
		snd = <Sound url={sprite.sound} playStatus={Sound.status.PLAYING} loop={false} />;
	}
	// main bit
	let S = <div title={getType(sprite)+' '+sprite.id} 
		style={style} onClick={e => GameControls.select({sprite})}
		>{img}{snd}</div>;
	// debug {Math.round(sprite.x)} {Math.round(sprite.y)}
	
	if (sprite.dropzone) {
		return <DropZone id={sprite.id}>{S}</DropZone>;
	}
	return S;
};

export default VSprite;
