
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Spell extends DataClass {
	name;
	damage;
	affinity;
	/** @typedef {Sprite} */
	carrier;
	
	constructor(base) {		
		super();
		this._init(base);
	}
}
DataClass.register(Spell,'Spell');
Spell.str = f => `Spell[${f.name}]`;

const This = Spell;
export default Spell;
