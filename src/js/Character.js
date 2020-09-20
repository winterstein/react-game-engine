import DataClass from "./base/data/DataClass";
import Sprite from "./data/Sprite";
import Spell from "./data/Spell";
import SpriteLib from "./data/SpriteLib";


class Character extends Sprite {

};
DataClass.register(Character,'Character');
export default Character;

let james = new Character({
	name: "James",
	surname: "Findlay",
	age: 13,
	src: "/img/src/person/james.png",
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
	age: 16,
	src: "/img/src/person/cassie.png", 
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
	src: "/img/src/person/mom.png"
});
let dad = new Character({
	name: "Dad", 
	surname: "Findlay",
	src: "/img/src/person/dad.png"
});


let katie = new Character({
	name: "Katie", 
	surname: "McDougall",
	src: "/img/src/person/katie.png",
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
	age: 15,
	spells: [
	], 
	health: 100, 
	maxHealth: 100,
	affinity: 'reptile'
});


let mina = new Character({
	name: "Mina", 
	surname: "Singh",
	age: 13,
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
	affinity: "bug",
	spells: [
		new Spell({name:'Midge',affinity:'bug',damage:10}), 
	], 
});

let eilidh = new Character({
	name:"Eilidh",
	surname:"Fraser",
	affinity: "bird",
	spells: [
		new Spell({name:'Punch',damage:10}), 
		new Spell({name:'Kick',damage:15}), 
	], 
});


let omega = new Character({
	name: "omega",
	src: "/img/src/person/omega.gif",
});


let angel = new Character({
	name:"Angel",
	src: "/img/src/person/angel.png",
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

let honeybadger = new Character({ name: "Honey Badger", src: "/img/src/honey-badger.w150.png", 
	spells: [
		new Spell({name:'Rampage',damage:40,affinity:'mammal'}),
		new Spell({name:'Chaos',damage:30,affinity:'mammal'}),
		new Spell({name:'Stink Attack',damage:60,affinity:'mammal'}),
	], 
	health: 200,
	affinity: 'mammal'
});


export const CHARACTERS = {
	james, cassie, mom, dad, katie, donald, mina, david,
	spider,
	honeybadger,
	eilidh
};


