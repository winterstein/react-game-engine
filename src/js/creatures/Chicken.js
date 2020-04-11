import SpriteLib from "../data/SpriteLib";

const Chicken = new KindOfCreature('Chicken');

Chicken.kingdom = 'animal';

Chicken.sprites = [SpriteLib.chicken(), SpriteLib.chicken(1), SpriteLib.chicken(2)];

Chicken.speed = 125;

Chicken.terrains = ['Grass','Earth','Water',];

Chicken.flees = ['Wolf','Badger','Goose'];

Game.addKind(null, Chicken);

export default Chicken;
