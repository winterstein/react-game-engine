import { assMatch } from "sjtest";
import Enum from 'easy-enums';

/**
 * For keyboard events
 */
class Key {
	isDown;
	isUp = true;
	press = undefined;
	release = undefined;

	constructor(value) {
		assMatch(value, String);
		this.value = value;
		const key = this;
		//The `downHandler`
		key.downHandler = event => {
			if (event.key === key.value) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
				event.preventDefault();
			}
		};
	
		//The `upHandler`
		key.upHandler = event => {
			if (event.key === key.value) {
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
				event.preventDefault();
			}
		};
	
		//Attach event listeners
		const downListener = key.downHandler.bind(key);
		const upListener = key.upHandler.bind(key);
		
		window.addEventListener("keydown", downListener, false);
		window.addEventListener("keyup", upListener, false);
		
		// Detach event listeners
		key.unsubscribe = () => {
			window.removeEventListener("keydown", downListener);
			window.removeEventListener("keyup", upListener);
		};		
	}
}

const KEYS = new Enum("ArrowLeft ArrowRight ArrowUp ArrowDown");
export {
	KEYS
};
export default Key;
