

import DataClass, {getType} from '../base/data/DataClass';
import Rect from './Rect';

class Grid extends DataClass {

}
DataClass.register(Grid, 'Grid');
const This = Grid;
export default Grid;


const RT2 = Math.sqrt(2);


/**
 * Isometric projection:
 * x: right-left
 * y: right-down
 * z: up (height)
 * @return [x,y]
 */
Grid.screenFromGame = (x,y,z=0) => {
	return [(x+y)*RT2, (y-x)*RT2 - z];
};

Grid.tileWidth = 100;
Grid.tileHeight = 100;

Grid.tileFromGame = (x,y) => {
	return [Math.floor(x/Grid.tileWidth), Math.floor(y/Grid.tileHeight)];
};

Grid.rectForTile = (x,y) => {
	return new Rect({x:x*Grid.tileWidth, y:y*Grid.tileHeight, width:Grid.tileWidth, height:Grid.tileHeight});
};
