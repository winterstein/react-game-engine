import DataClass, { nonce } from "../base/data/DataClass";
import { assMatch } from "sjtest";
import { getPSpriteFor } from "../components/Pixies";

/**
 * TODO Provide a shared storage of common info across same-type sprites.
 *  -- this will make game states much smaller!
	// TODO move kind, frames, src, etc into here
*/


class KindOfCreature extends DataClass {
	
	name;
	
	/**
	 * @type {?Boolean} if true, this is a background tile
	 */
	bg;

	kingdom;	

	sprites;
	
	speed;

	terrains;	

	chases;

	flees;

	updater;

	constructor(name) {
		super({});
		assMatch(name, String);
		this.name = name;
		KindOfCreature.kinds[name] = this;
	}
}
DataClass.register(KindOfCreature, 'KindOfCreature');

/**
 * @type {String : KindOfCreature}
 */
KindOfCreature.kinds = {};

// NB: allow no-import use
window.KindOfCreature = KindOfCreature;
export default KindOfCreature;
