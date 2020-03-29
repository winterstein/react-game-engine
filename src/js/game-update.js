
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
	// tile shine?
	let selectTile = game.sprites.selectTile;
	if (selectTile) {
		selectTile.x = rc.column * grid.tileWidth;
		selectTile.y = rc.row * grid.tileHeight;
		Sprite.setPixiProps(selectTile);
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
	const dt = StopWatch.dt(game.ticker);

	// What would the sprite like to do?
	const Kind = game.kinds[s.kind] || {};
	if (Kind.updater) {
		Kind.updater({kind:Kind, sprite:s, game, dt});
	}	

	s.old = {x:s.x, y:s.y, z:s.z}; // NB: record old x,y so we can step-back onCollision
	
	s.x += s.dx * dt;
	s.y += s.dy * dt;
	s.z += s.dz * dt;

	// screen wrap?
	const grid = Game.grid(game);
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

	// set animation from dx/dy
	let a;
	if (s.dy < 0) a = 'up';
	if (s.dy > 0) a= 'down';
	if (s.dx < 0) a = 'left';
	if (s.dx > 0) a = 'right';
	if ( ! s.dx && ! s.dy) a = 'stop';
	if (a) Sprite.animate(s, a);
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
