import Game from "../Game";
import KindOfCreature from './KindOfCreature';
import SpriteLib from '../data/SpriteLib';
import Sprite from '../data/Sprite';


const Earth = new KindOfCreature('Earth');
Earth.bg = true;
Earth.kingdom = 'mineral';

Earth.sprites = [SpriteLib.tile('Earth')];

Earth.speed = 0;

export default Earth;
