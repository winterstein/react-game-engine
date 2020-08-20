
import DataClass, {getType, nonce} from '../base/data/DataClass';

class Command extends DataClass {
	/**
	 * @typedef {!String}
	 */
	name;
	/**
	 * @typedef {Boolean}
	 */
	done;

	/**
	 * @typedef {import('../StopWatch').TimeNumber}
	 */
	duration = 1000;

	/**
	 * @typedef {import('../StopWatch').TimeNumber}
	 */
	startTick;

	constructor(name, params) {
		super(params); // base
		this.name = name;
	}
}
DataClass.register(Command, 'Command');
export default Command;

/**
 * 
 * @param {TimeNumber} tick
 * @returns {?Command} falsy if the queue is empty
 */
Command.tick = (tick) => {
	const c = Command.peek();
	if ( ! c) return false;
	if ( ! c.startTick) c.startTick = tick;
	if (tick - c.startTick > c.duration) {
		// Done!!
		pop
		return false;
	}
	// not done
	return c;
};

/**
 * @typedef {Command[]}
 */
Command._q = [];
/**
 * 
 * @param {Sprite|Fight} target 
 * @param {Command} command 
 */
export const cmd = (target, command) => {
	Command._q.push({target,command});
};

/**
 * @returns {?Command}
 */
Command.peek = () => Command._q[0];
