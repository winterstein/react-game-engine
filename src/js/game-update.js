
import Game, {dist2} from './Game';
import Grid from './data/Grid';
import StopWatch from './StopWatch';
import Sprite from './data/Sprite';
import KindOfCreature from './creatures/KindOfCreature';
import Tile from './data/Tile';
import { getPSpriteFor, containerFor, getPApp } from './components/Pixies';
import { collision } from './components/Collision';
import * as PIXI from 'pixi.js';
import SpriteLib from './data/SpriteLib';

/**
 * Behaviour updates less often
 */
let slowDt = 0;

/**
 * @param {!Game} game
 */
Game.update = game => {
	// tick
	if ( ! StopWatch.update(game.ticker)) {
		return;
	}	
	// pixi ready?
	const papp = getPApp();
	if ( ! papp || ! papp.loadFlag) {
		return;
	}

	const dt = StopWatch.dt(game.ticker);
	slowDt += dt;

	// player
	let player = Game.getPlayer(game);	
	if (player) {
		updatePlayer(game, player);
	}
	
	// update sprite behaviour?	
	if (slowDt > 0.5) { // reactions can be slower than animation -- 1/5 second feels OK
		const udt = slowDt;
		slowDt = 0;
		// What would the sprite like to do?
		Object.values(game.sprites).forEach(s => {
			if (s === player) return;
			if ( ! s.visible) return;
			if (Tile.isa(s)) {
				return; // no update 
			}		
			const Kind = KindOfCreature.kinds[s.kind] || {};
			// Update behaviour
			let updater = Kind.updater || KindOfCreature.updater;
			updater({kind:Kind, sprite:s, game, dt:udt});			
			// set animation from dx/dy
			setAnimationFromDirn(s);
		});
	}
			
	// animate! update stage and sprites
	Object.values(game.sprites).forEach(s => updateSprite(s,game, dt));

	// collisions?

	// off screen?

	// focus on X?
};

const setAnimationFromDirn = s => {
	let a;
	if (s.dy < 0) a = 'up';
	if (s.dy > 0) a= 'down';
	if (s.dx < 0) a = 'left';
	if (s.dx > 0) a = 'right';
	if ( ! s.dx && ! s.dy) a = 'stop';
	if (a) Sprite.animate(s, a);
};

/**
 * The normal updateSprite has already run!
 * @param {Game} game 
 * @param {Sprite} player 
 */
const updatePlayer = (game, player) => {
	// more often than behaviour ticks
	setAnimationFromDirn(player);
	// off screen? move the screen
	let rc = Game.getTileInFront(game, player);
	let grid = Grid.get();
	// screen?
	let screen = Grid.screen(grid);
	let mx = grid.vw * 20;
	let my = grid.vh * 20;
	if (player.x < screen.x + mx) {
		screen.x = Math.max(0, player.x - mx);
	} else if (player.x > screen.x + screen.width - mx) {
		screen.x = player.x + mx - screen.width;
	}
	if (player.y < screen.y + my) {
		screen.y = Math.max(0, player.y - my);
	} else if (player.y > screen.y + screen.height - my) {
		screen.y = player.y + my - screen.height;
	}
	containerFor.world.position = new PIXI.Point( - screen.x * grid.screenScale, - screen.y * grid.screenScale);	
};

/**
 * 
 * @param {!Game} game
 * @param {!Sprite} s 
 */
const updateSprite = (s, game, dt) => {
	// off screen?
	const grid = Grid.get();
	const screen = Grid.screen(grid);
	const psprite = getPSpriteFor(s);
	if ( ! s.ui && psprite) {
		if (collision(s, screen)) {
			psprite.visible = true;
			s.visible = true;
		} else {
			psprite.visible = false;
			s.visible = false;
			// HACK - for speed no updates
			return;
		}
	}

	if (Tile.isa(s)) {
		return; // no update 
	}	

	// What would the sprite like to do?
	const Kind = KindOfCreature.kinds[s.kind] || {};

	s.old = {x:s.x, y:s.y, z:s.z}; // NB: record old x,y so we can step-back onCollision
	
	s.x += s.dx * dt;
	s.y += s.dy * dt;
	s.z += s.dz * dt;

	// screen wrap?	
	const maxx = grid.width*grid.tileWidth;
	const maxy = grid.height*grid.tileHeight;
	if (s.x < - Sprite.width(s)) {		
		s.x = maxx;
	}
	if (s.x > maxx) {		
		s.x = - Sprite.width(s);
	}
	if (s.y < - Sprite.height(s)) {		
		s.y = maxy;
	}
	if (s.y > maxy) {		
		s.y = - Sprite.height(s);
	}

	// allowed terrain check
	let terrains = Kind.terrains;
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

	// animation tick
	Sprite.updateAnimation(s, game);

	Sprite.setPixiProps(s);
};


// replace this!
KindOfCreature.updater = ({kind, game, sprite, dt}) => {
	if (kind.kingdom === 'mineral' || kind.kingdom === 'vegetable') {
		return; // no update for dead stuff
	}
	// mostly no change
	if (Math.random() < 0.75) return;
	
	if (kind.flees) {
		let near = Game.getNearest({sprite, game, types:kind.flees, limit:3});		
		if (near) {
			Sprite.turnTowards(sprite, near);
			// turn around!
			sprite.dx = - sprite.dx;
			sprite.dy = - sprite.dy;			
			return;
		}
	}

	if (kind.chases) {
		let near = Game.getNearest({sprite, game, types:kind.chases, limit:5});
		if (near) {
			Sprite.turnTowards(sprite, near);
			
			// close enough to bite?
			// TODO collision test instead - cos this requires near total overlap
			if (dist2(sprite,near) < 100) {
				if (sprite.kind !== near.kind) { // no cannibals
					KindOfCreature.doBite(kind, sprite,near);
				}
			}

			return;
		}		
	}

	// wander
	if (Math.random() <	0.1) {
		// pick a direction	
		sprite.theta = Math.random()*Math.PI*2;
		let speed = sprite.speed || kind.speed;
		if ( ! speed && speed !== 0) speed = 10; // TODO respect 0
		sprite.dx = Math.cos(sprite.theta) * speed;
		sprite.dy = Math.sin(sprite.theta) * speed;
		return;
	}
};


/**
 * 
 * @param {!Sprite} predator 
 * @param {!Sprite} prey 
 */
KindOfCreature.doBite = (kind, predator, prey) => {
	if (prey.health===undefined) prey.health = 100;
	prey.health -= kind.attack || 10;
	// console.log("Bite! "+predator.kind+" "+prey.kind+" -> "+prey.health);
	// TODO show health bar for 1/2 second
	if (getPSpriteFor(prey)) {
		// health bar
		// const graphics = new PIXI.Graphics();
		// graphics.beginFill(prey.health > 50? 0x33FF00 : 0xFF3300);
		// let hw = 48 * prey.health/100;
		// graphics.drawRect(0, 44, hw, 4);
		// graphics.endFill();
		// psprite.addChild(graphics);
	}	
	if (prey.health <= 0) {
		if (predator.health < 100) predator.health += 5;
		doDie(Game.get(), prey);
	}
};

const doDie = (game, sprite) => {
	// TODO death sequence - or maybe we replace the sprite with a "dying sprite"
	Game.removeSprite(game, sprite);
	let kind = KindOfCreature.kinds[sprite.kind];
	if ( ! kind) {
		console.warn("No kind? ",sprite);
		return;
	}
	if (kind.kingdom==='animal') {
		// leave some meat
		let meat = Game.make('Meat',{x:sprite.x, y:sprite.y});
	}
	if (kind.name==='Tree') {
		// leave some wood
		let wood = Game.make('Wood', {x:sprite.x, y:sprite.y});
	}	
};


/**
 * @returns [1 - 6] randomly
 */
const rollDice = () => 1 + Math.floor(Math.random()*6);
window.rollDice = rollDice;

export default {}; // dummy export to keep imports happy
