import { assMatch } from "sjtest";
import Enum from 'easy-enums';

/**
 * For keyboard events. You can either provide a handler for press() or release(), or check for the isDown flag
 */
class Key {
	isDown;
	press = undefined;
	release = undefined;
	preventDefault;

	/**
	 * Set isDown = false. Use-case: after some stop incident, to ensure the key isn't firing (until the user re-presses)
	 */
	reset() {
		this.isDown = false;
	}

	constructor(value) {
		assMatch(value, String);
		this.value = value;
		const key = this;
		//The `downHandler`
		key.downHandler = event => {
			if (event.key === key.value) {
				if ( ! key.isDown) {
					console.log("Key down: "+value);
					if (key.press) key.press();
				}
				key.isDown = true;				
				if (this.preventDefault) event.preventDefault();
			}
		};
	
		//The `upHandler`
		key.upHandler = event => {
			if (event.key === key.value) {
				if (key.isDown) {
					console.log("Key up: "+value);
					if (key.release) key.release();
				}
				key.isDown = false;
				if (this.preventDefault) event.preventDefault();
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
