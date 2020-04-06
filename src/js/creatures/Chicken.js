
const Chicken = new KindOfCreature('Chicken');

Chicken.kingdom = 'animal';

Chicken.sprites = [SpriteLib.chicken(), SpriteLib.chicken(1)];

Chicken.speed = 125;

Chicken.terrains = ['Grass','Earth','Water',];

Chicken.flees = ['Wolf','Badger','Goose'];

Game.addKind(game, Chicken);
