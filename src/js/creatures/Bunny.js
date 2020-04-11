import SpriteLib from "../data/SpriteLib";
import KindOfCreature from './KindOfCreature';
import Game from "../Game";

const Bunny = new KindOfCreature('Bunny');

Bunny.kingdom = 'animal';

Bunny.sprites = [SpriteLib.bunny(), SpriteLib.bunny(1), SpriteLib.bunny(2)];

Bunny.speed = 50;

Bunny.terrains = ['Grass','Earth'];

Bunny.flees = ['Wolf','Badger'];


/**
 * Add breeding behaviour
 */
Bunny.updater = ({sprite,game,dt}) => {	
	// breed?
	if (sprite.unready) sprite.unready -= dt;
	maybeBreed({sprite,game,dt});
	// basic behaviour
	KindOfCreature.updater({kind:Bunny, sprite, game, dt});
};

const maybeBreed = ({sprite,game, dt}) => {
	let nearbyBunny = Game.getNearest({sprite, game, types:['Bunny'], limit:1});
	if ( ! nearbyBunny) return;
	// too many already?
	if (Game.getAllSprites('Bunny').length > 1000) return;
	// are these bunnies ready?
	if (sprite.unready > 0 || nearbyBunny.unready > 0) return;
	// hooray - breed	
	let babyBunny = Game.make('Bunny', {x:sprite.x, y:sprite.y});
	babyBunny.unready = 20;
	sprite.unready = 10;
	nearbyBunny.unready = 10;
};

Game.addKind(null, Bunny);

export default Bunny;
