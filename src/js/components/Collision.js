
import Rect from '../data/Rect';

const getImageData = (sprite) => {
	if (sprite.imageData) return sprite.imageData;
	let canvas = document.getElementById('_imgdata');
	let context = canvas.getContext('2d');
	// The pixel color values. The data is stored in RGBA order so data[0] is pixel 0's red channel, data[1] is pixel 0's green channel, data[2] is pixel 0's blue channel, data[3] is pixel 0's alpha channel, data[4] is pixel 1's red channel, etc.
	let scale = 1;
	context.scale(scale,scale); // shrink for efficiency
	context.drawImage(sprite.Image, 0, 0); //sprite.Image.naturalWidth/scale, sprite.Image.naturalHeight/scale);
	sprite.imageData = context.getImageData(0,0, sprite.Image.naturalWidth/scale, sprite.Image.naturalHeight/scale);
	return sprite.imageData;
};

const collision = (sprite1, sprite2) => {
	// if ( ! Rect.intersects(sprite1, sprite2)) return;
	let i1 = getImageData(sprite1);
	let i2 = getImageData(sprite2);
	console.log("Imagedata",i1,i2);
};

export {
	getImageData, collision
};
