import DataClass from "./base/data/DataClass";
import Sprite from "./data/Sprite";
import Spell from "./data/Spell";
import SpriteLib from "./data/SpriteLib";
import Monster from "./data/Monster";
import { toTitleCase } from "./base/utils/miscutils";

const MONSTERS = {};

const add = monster => {
	Monster.assIsa(monster);
	assMatch(monster.name, String);
	let name = monster.name;
	let cname = name.toLowerCase().replaceAll(/\W/g, '-');
	MONSTERS[cname] = monster;
	return monster;
};

/**
 * 
 * @param {*} name case and whitespace insensitive
 * @returns {?Monster}
 */
const getMonsterByName = name => {
	let cname = name.toLowerCase().replaceAll(/\W/g, '-');
	let monster = MONSTERS[cname];
	return monster;
};

add(new Monster({
	name: "Collector Bot",
	src: "/img/src/monster/collector-bot.png",
	// TODO cc Jonathan Barker / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)
	spells: [new Spell({ name: 'Snip', damage: 25 }), new Spell({ name: 'Grab', damage: 10 })],

	health: 50,
	agility: 10,
}));

add(new Monster({
	name: "Laser Pike",
	src: "/img/src/monster/laser-pike.png",
	// TODO cc Jonathan Barker / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)
	spells: [new Spell({ name: 'Zap', damage: 20 }), new Spell({ name: 'Bite', damage: 10 })],
	health: 100,
	affinities: { fish: 'strong' }
}));

add(new Monster({
	name: "Angry Smelly Robot", src: '/img/src/smelly-bot.w200.png',
	spells: [new Spell({ name: 'Smelly Punch', damage: 20 }), 'Sharp Kick'],
	health: 40
	// affinities: { plant: 'weak', mammal: 'strong' }
}));
add(new Monster({
	name: "Pineapple Bot", src: '/img/src/pineapple-bot.w200.png',
	spells: [
		new Spell({ name: 'concerswing', damage: 1 }),
		new Spell({ name: 'spikyturn', damage: 21 }),
		new Spell({ name: 'pufferfish', damage: 50 }),
		new Spell({ name: 'frogkick', damage: 30 })
	],
	health: 140
	// affinities: { bird: 'weak', fish: 'strong' }
}));
add(new Monster({
	name: "Angry Jellyfish", src: '/img/src/jellyfish.h200.png',
	spells: [
		new Spell({ name: 'stinging grasp', damage: 19 }),
		new Spell({ name: 'scare stare', damage: 2 }),
	],
	health: 14
	// affinities: { bug: 'weak', reptile: 'strong' }
}));

export default MONSTERS;
export {
	getMonsterByName
};
