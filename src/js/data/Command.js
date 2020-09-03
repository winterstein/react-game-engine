
import DataClass, {getType, nonce} from '../base/data/DataClass';
import { assMatch, assert } from '../base/utils/assert';
import StopWatch from '../StopWatch';
import { space } from '../base/utils/miscutils';
import printer from '../base/utils/printer';

class Command extends DataClass {
	id = nonce(4);
	/**
	 * @typedef {Sprite}
	 */
	subject;
	/**
	 * @typedef {!String}
	 */
	verb;
	/**
	 * @typedef {Sprite|string|any} e.g. field name for "set"
	 */
	object;

	/**
	 * @typedef {Boolean}
	 */
	started;
	/**
	 * @typedef {Boolean}
	 */
	finished;

	/**
	 * @typedef {import('../StopWatch').EpochMSecs}
	 */
	duration = 1000;

	/**
	 * @typedef {import('../StopWatch').EpochMSecs}
	 */
	startTick;

	/**
	 * @typedef {?Command}
	 */
	then;

	constructor(subject, verb, object, value, params) {
		super(); // base
		DataClass._init(this, params);
		this.subject = subject;
		this.verb = assMatch(verb, String);
		this.object = object;
		this.value = value;		
	}

	setDuration(msecs) {
		this.duration = msecs;
		return this;
	}
}
DataClass.register(Command, 'Command');
export default Command;


Command.str = c => space(c.id, DataClass.str(c.subject), c.verb, c.object, c.value, 
	c.startTick && c.latestTick && "done: "+printer.str(100*(c.latestTick - c.startTick)/c.duration)+"% of "+c.duration
);
/**
 * 
 * @param {import('../StopWatch').EpochMSecs} tick
 * @returns {?Command} falsy if the queue is empty
 */
Command.tick = (tick) => {
	const c = Command.peek();
	if ( ! c) return false;
	if ( ! c.startTick) c.startTick = tick;
	c.latestTick = tick;
	let dmsecs = tick - c.startTick;
	if (dmsecs < c.duration) {
		Command.updateCommand(c, dmsecs);		
		return c;
	}
	
	// Done!!	
	assert(c.started, c);
	assert( ! c.finished, "Not finished?!", c);
	Command.finish(c);
	c.finished = true;
	// NB: do after finish, so any commands added during finish() dont preemptively start
	const _c = Command._q.shift();
	assert(c === _c, "Command.js", c, _c);

	// next?
	if (c.then) {
		// NB: c.then is _not_ queued, so we now elbow it into the queue
		Command._q.unshift(c.then);
	}
	let c2 = Command.peek();
	if (c2) {
		assert( ! c2.started, "Already started?!",c2, "after",c);
		Command.start(c2);
		c2.started = true;
		return c2;
	}
	// all done
	return false;
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
export const cmd = (command) => {
	Command.assIsa(command);
	assert( ! Command._q.includes(command), "Command.js - Already queued!",command);
	// if (goFirst) {
	// 	Command._q.unshift(command);
	// } else {
	Command._q.push(command);
	// }
	if (Command._q.length===1) {
		assert( ! command.started, "No - Already started?!", command);
		Command.start(command);
		command.started = true;
	}
};

/**
 * @returns {?Command}
 */
Command.peek = () => Command._q[0];

