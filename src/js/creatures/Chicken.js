import SpriteLib from "../data/SpriteLib";

const Chicken = new KindOfCreature('Chicken');

Chicken.kingdom = 'animal';

Chicken.sprites = [SpriteLib.chicken(), SpriteLib.chicken(1), SpriteLib.chicken(2),SpriteLib.chicken(3)];

Chicken.speed = 125;

Chicken.terrains = ['Grass','Earth','Water','Tree'];

Chicken.flees = ['Wolf','Badger','Goose'];

export default Chicken;
