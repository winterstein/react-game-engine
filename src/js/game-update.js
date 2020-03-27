
import Game from './Game';
import StopWatch from './StopWatch';
import Sprite from './data/Sprite';
import Tile from './data/Tile';

/**
 * @param {!Game} game
 */
Game.update = game => {
	// tick
	if ( ! StopWatch.update(game.ticker)) {
		return;
	}	
	// TODO update stage and sprites
	Object.values(game.sprites).forEach(s => updateSprite(s,game));

	// player
	let player = Game.getPlayer(game);	
	if (player) {
		updatePlayer(game, player);
	}

	// collisions?

	// off screen?

	// focus on X?
};

/**
 * The normal updateSprite has already run!
 * @param {*} game 
 * @param {*} player 
 */
const updatePlayer = (game, player) => {
	let rc = Game.getTileInFront(game, player);
	let grid = Game.grid(game);
	// TODO shine!
	// console.log("Game.getTileInFront", rc);
	let selectTile = game.sprites.selectTile;
	if (selectTile) {
		selectTile.x = rc.column * grid.tileWidth;
		selectTile.y = rc.row * grid.tileHeight;
		Sprite.setPixiProps(selectTile);
	} else {
		console.warn("huh");
	}	
};

/**
 * 
 * @param {!Game} game
 * @param {!Sprite} s 
 */
const updateSprite = (s, game) => {
	if (Tile.isa(s)) {
		return; // no update 
	}

	// What would the sprite like to do?
	if (s.kind) {
		let ufn = updaterForAnimal[s.kind];
		if (ufn) ufn(s, game);
	}

	s.old = {x:s.x, y:s.y, z:s.z}; // NB: record old x,y so we can step-back onCollision

	const dt = StopWatch.dt(game.ticker);
	s.x += s.dx * dt;
	s.y += s.dy * dt;
	s.z += s.dz * dt;	
	// allowed terrain check
	let terrains = terrainsForAnimal[s.kind];
	if (terrains) {
		const {row,column} = Game.getRowColumn(game, s);
		const tile = Game.getTile({game, row, column});
		if (tile && tile.kind) {
			if ( ! terrains.includes(tile.kind)) {
				// no go
				s.x = s.old.x;	s.y = s.old.y;	s.z = s.old.z;
			}
		}
	}

	// set animation from dx/dy
	if (s.dy < 0) Sprite.animate(s, 'up');
	if (s.dy > 0) Sprite.animate(s, 'down');
	if (s.dx < 0) Sprite.animate(s, 'left');
	if (s.dx > 0) Sprite.animate(s, 'right');
	if ( ! s.dx && ! s.dy) Sprite.animate(s, 'stop');

	Sprite.updateAnimation(s, game);

	Sprite.setPixiProps(s);
};

/**
 * @returns [1 - 6] randomly
 */
const rollDice = () => 1 + Math.floor(Math.random()*6);
window.rollDice = rollDice;


const updateSheep = (sprite,game) => {
	// TODO Chase / Fight / Flee
	// mostly no change
	if (Math.random() < 0.95) return;
	sprite.speed = 20;
	// flock?
	if (Math.random() < 0.6) {
		let near = Game.getNearest({sprite, game, types:['Sheep']});
		if (near) {
			Sprite.turnTowards(sprite, near);
			return;
		}
	}
	// pick a direction	
	sprite.theta = Math.random()*Math.PI*2;		
	sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 1);
	sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 1);
};


const updateWolf = (sprite,game) => {
	sprite.speed = 20;
	// Chase nearby sheep
	let near = Game.getNearest({sprite, game, types:['Sheep'], limit:5});
	if (near) {
		Sprite.turnTowards(sprite, near);
		return;
	}
	if (rollDice()===6 && rollDice()===6) {
		// pick a new random direction	
		sprite.theta = Math.random()*Math.PI*2;		
		sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 1);
		sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 1);
	}
};


const updateRandomWalk = (sprite,game) => {
	// mostly no change
	if (Math.random() < 0.95) return;
	sprite.speed = 20;
	// pick a direction	
	sprite.theta = Math.random()*Math.PI*2;		
	sprite.dx = Math.cos(sprite.theta) * (sprite.speed || 1);
	sprite.dy = Math.sin(sprite.theta) * (sprite.speed || 1);
};

/**
 * These set dx,dy -- they do NOT update x and y!
 */
const updaterForAnimal = {
	Sheep: updateSheep,
	Frog: updateRandomWalk,
	Wolf: updateWolf,
	Werewolf: updateRandomWalk,
	Chicken: updateRandomWalk,
	Badger: updateRandomWalk,
	Fish: updateRandomWalk,
	Goat: updateRandomWalk,
};

/**
 * What tiles can they walk on?
 */
const terrainsForAnimal = {
	Sheep: ['Grass','Earth'],
	Wolf: ['Grass','Earth'],
	Fish: ['Water'],
};


export default {}; // dummy export to keep imports happy
export {
	updaterForAnimal
};
