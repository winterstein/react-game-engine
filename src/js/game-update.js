
import Game, {dist2} from './Game';
import Grid from './data/Grid';
import StopWatch from './StopWatch';
import Sprite from './data/Sprite';
import Tile from './data/Tile';
import { getPSpriteFor, containerFor, getPApp } from './components/Pixies';
import * as PIXI from 'pixi.js';

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
	// update stage and sprites
	Object.values(game.sprites).forEach(s => updateSprite(s,game));

	// player
	let player = Game.getPlayer(game);	
	if (player) {
		updatePlayer(game, player);
	}

	const dt = StopWatch.dt(game.ticker);
	slowDt += dt;

	// realtime behaviour??
			
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
	// const Kind = KindOfCreature.kinds[s.kind] || {};

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

	// animation tick
	Sprite.updateAnimation(s, game);

	Sprite.setPixiProps(s);
};


/**
 * @returns [1 - 6] randomly
 */
const rollDice = () => 1 + Math.floor(Math.random()*6);
window.rollDice = rollDice;

export default {}; // dummy export to keep imports happy
