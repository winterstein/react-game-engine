import DataClass from "./base/data/DataClass";
import Sprite from "./data/Sprite";
import Spell from "./data/Spell";
import SpriteLib from "./data/SpriteLib";
import Game from "./Game";

const CHARACTERS = {};

class Character extends Sprite {

	constructor(base) {
		super(base);
		// HACK
		this.id = this.name.toLowerCase();
		CHARACTERS[this.id] = this;
	}

};
DataClass.register(Character,'Character');
export default Character;

let james = new Character({
	name: "James",
	surname: "Findlay",
	fighter: true,
	age: 13,
	src: "/img/src/person/james.svg",
	spells: [
		new Spell({name:'Bunny', damage:5, affinity:'mammal', carrier:SpriteLib.bunny()}), 
		new Spell({name:'Wolf', damage:15, affinity:'mammal', carrier:SpriteLib.wolf()}), 
		new Spell({name:'super healing herbs',damage:-100, affinity:'plant'}),
		new Spell({name:'Ladybird', affinity:'bug'}),
		new Spell({ name:'fierce snake',damage:50, affinity:'reptile'})
	],
	health: 100, 
	maxHealth: 100,
	affinity: 'mammal'
});

let cassie = new Character({
	name: "Cassie", 
	surname: "Findlay",
	fighter: true,
	age: 16,
	src: "/img/src/person/cassie.svg", 
	emotion: {
		unhappy: "/img/src/person/cassie-unhappy.svg", 
	},
	photo: "/img/src/person/cordelia.jpg",
	spells: [
	], 
	health: 100, 
	maxHealth: 100,
	affinity: 'mammal'
});

let mom = new Character({
	name: "Mom", 
	surname: "Findlay",
	src: "/img/src/person/mom.svg",
	emotion: {
		happy: "/img/src/person/mom-happy.svg", 
		vhappy: "/img/src/person/mom-vhappy.svg", 
	},
});
let dad = new Character({
	name: "Dad", 
	surname: "Findlay",
	src: "/img/src/person/dad.svg"
});


let katie = new Character({
	name: "Katie", 
	surname: "McDougall",
	fighter: true,
	src: "/img/src/person/katie.svg",
	emotion: {
		happy: "/img/src/person/katie-happy.svg", 
		vhappy: "/img/src/person/katie-v-happy.svg", 
	},
	age: 13,
	spells: [
		new Spell({name:'Fish',affinity:'fish',damage:10, carrier:SpriteLib.fish()}), 
		new Spell({name:'Chicken',affinity:'bird',damage:10, carrier:SpriteLib.chicken()}), 
		new Spell({name:'Goose',affinity:'bird',damage:15, carrier:SpriteLib.goose()}), 
	], 
	health: 100, 
	maxHealth: 100,
	affinity: 'bird'
});


let donald = new Character({
	name: "Donald", 
	surname: "McDougall",
	fighter: true,
	age: 15,
	src: "/img/src/person/donald.svg",
	spells: [
	], 
	health: 100, 
	maxHealth: 100,
	affinity: 'reptile'
});


let mina = new Character({
	name: "Mina", 
	surname: "Singh",
	fighter: true,
	age: 13,
	src: "/img/src/person/mina.svg",
	spells: [
		new Spell({name:'Healing Herbs',affinity:'plant',damage:-40}),
		new Spell({name:'Nettle',affinity:'plant',damage:40})
	], 
	health: 100, 
	maxHealth: 100,
	affinity: 'plant'
});

let david = new Character({
	name:"David",
	surname:"McFadden",
	fighter: true,
	src: "/img/src/person/david.svg",
	affinity: "bug",
	spells: [
		new Spell({name:'Midge',affinity:'bug',damage:10}), 
	], 
});

let eilidh = new Character({
	name:"Eilidh",
	surname:"Fraser",
	fighter: true,
	src: "/img/src/person/eilidh.svg",
	emotion: {
		scared: "/img/src/person/eilidh-scared.svg",
	},
	spells: [
		new Spell({name:'Punch',damage:5}), 
		new Spell({name:'Kick',damage:10}), 
	], 
	// starts low!
	agility: 1,
	maxHealth: 5
});


let omega = new Character({
	name: "omega",
	src: "/img/src/person/omega.gif",
});


let dardariel = new Character({
	name:"Dardariel",
	fighter: true,
	src: "/img/src/person/dardariel.png",
	affinity: "bird",
	spells: [
		new Spell({name:'Eagle',affinity:'bird',damage:200}), 
	], 
});

let spider = new Character({
	name:"Spider",
	src: "/img/src/person/spider.png",
	affinity: "bug"
});

let narrator = new Character({
	name:"Narrator",
	src: "none"
});


let honeybadger = new Character({ name: "Honey Badger", src: "/img/src/honey-badger.w150.png", 
	fighter: true,
	spells: [
		new Spell({name:'Rampage',damage:40,affinity:'mammal'}),
		new Spell({name:'Chaos',damage:30,affinity:'mammal'}),
		new Spell({name:'Stink Attack',damage:60,affinity:'mammal'}),
	], 
	health: 200,
	affinity: 'mammal'
});

let infectedPhone = new Character({ name: "Infected Phone", src: "/img/src/phone.png", 
});


let benj = new Character({
	name:"Benj",
	src: "/img/src/person/benj.svg",
	emotion: {
		worried: "/img/src/person/benj-worried.svg",
		confused: "/img/src/person/benj-confused.svg",
		praying: "/img/src/person/benj-praying.svg",
	},
	affinity: "fish",
	spells: [
		new Spell({name:'Knife attack', damage:10, affinity:'metal'}),
		new Spell({name:'Throw a fish', damage:10, affinity:'fish'}),
	]
});

let ptangptang = new Character({
	name:"PTang PTang",
	src: "/img/src/person/ptang-ptang.png",
	affinity:'reptile',
	spells: [
		new Spell({name:'Thunderbolt! (small)', damage:10, affinity:'electric'}),
		new Spell({name:'Tail slap', damage:10, affinity:'reptile'}),
		new Spell({name:'Healing', damage:-100, affinity:'plant'}),
	]
});

let om = new Character({
	name:"Om",
	src: "/img/src/person/om.png",
	affinity:'reptile',
});

class Relationship extends DataClass {
	/**
	 * @type {Number} [0, 10]
	 */
	level;

	/**
	 * Towards the next level
	 * @type {Number} [0, 10]
	 */
	points;
}
DataClass.register(Relationship,"Relationship");

const RELATIONSHIPS = {};
/**
 * @param {Object} p
 * @param {String} p.name Case insensitive
 * @returns {!Relationship}
 */
const getRelationship = (name) => {
	name = name.toLowerCase();
	let r = RELATIONSHIPS[name];
	if ( ! r) {
		r = RELATIONSHIPS[name] = new Relationship();
	}
	return r;
};

export {
	CHARACTERS,
	getRelationship
};
window.CHARACTERS = CHARACTERS; // debug
