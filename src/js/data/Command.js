
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

}
DataClass.register(Command, 'Command');
export default Command;
