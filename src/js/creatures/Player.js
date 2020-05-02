import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Player = new KindOfCreature('Player');

Player.kingdom = 'player';

Player.sprites = [SpriteLib.goose()];

Player.speed = 50;

Player.attack = 100;

// Creature.terrains = ['Grass','Earth'];


Player.doAttack = () => {
	const game = Game.get();
	let player = game.sprites.player0;
	let nearbySprite = Game.getNearest({sprite:player, game, limit:1});
	if (nearbySprite) {
		KindOfCreature.doBite(Player, player, nearbySprite);
		// TODO a sparkle effect on the pickaxe
	}
	// chop a tree?
	let nearbyTile = Game.getNearest({sprite:player, game, types:['Tree'], tile:true, limit:1});
	if (nearbyTile) {
		KindOfCreature.doBite(Player, player, nearbyTile);
	}
};

Player.doUse = () => {
	const game = Game.get();
	let player = game.sprites.player0;
	let nearbySprite = Game.getNearest({sprite:player, game, filter:s => s.carry, tile:true, limit:1});
	// TDODO
};


export default Player;
