
import Rect from '../data/Rect';

const getImageData = (sprite) => {
	if (sprite.imageData) return sprite.imageData;
	let canvas = document.getElementById('_imgdata');
	canvas.style.display = 'block';
	let context = canvas.getContext('2d');
	// The pixel color values. The data is stored in RGBA order so data[0] is pixel 0's red channel, data[1] is pixel 0's green channel, data[2] is pixel 0's blue channel, data[3] is pixel 0's alpha channel, data[4] is pixel 1's red channel, etc.
	let scale = 4;
	context.scale(scale,scale); // shrink for efficiency
	context.drawImage(sprite.Image, 0, 0); //sprite.Image.naturalWidth/scale, sprite.Image.naturalHeight/scale);
	let imageData = context.getImageData(0,0, sprite.Image.naturalWidth/scale, sprite.Image.naturalHeight/scale);
	// let mask = imageData.data.length % 4 booleans
	sprite.imageData = imageData;
	canvas.style.display = 'none';
	return imageData;
};

const collision = (sprite1, sprite2) => {
	// x
	let lowx = Math.round(Math.max(sprite1.x, sprite2.x));
	let highx = Math.round(Math.min(sprite1.x+sprite1.width, sprite2.x+sprite2.width));
	// y
	let lowy = Math.round(Math.max(sprite1.y, sprite2.y));
	let highy = Math.round(Math.min(sprite1.y+sprite1.height, sprite2.y+sprite2.height));
	// no intersection?
	if (lowx>highx || lowy>highy) return false;
	let i1 = getImageData(sprite1);
	let i2 = getImageData(sprite2);
	let frame1 = sprite1.frames? sprite1.frames[sprite1.frame] : [0,0];
	let frame2 = sprite2.frames? sprite2.frames[sprite2.frame] : [0,0];
	for(let x=lowx; x<highx; x++) {
		for(let y=lowy; y<highy; y++) {
			let pixel1a = getPixel(sprite1, frame1, x, y, i1);
			let pixel1b = getPixel(sprite2, frame2, x, y, i2);
			if ( ! pixel1a) continue;
			if (pixel1b) {
				return [x,y];
			}
		}
	}
	console.log("Imagedata",i1,i2);
};

const getPixel = (sprite, frame, x, y, id) => {
	let sx = Math.round(x - sprite.x) + frame[0];
	let sy = Math.round(y - sprite.y) + frame[1];
	let pi = 4 * (sx + id.width * sy);
	return id.data[pi];
};

export {
	getImageData, collision
};
