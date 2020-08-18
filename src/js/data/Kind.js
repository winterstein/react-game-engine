
import DataClass, {getType} from '../base/data/DataClass';
import Sprite from './Sprite';

class Kind extends Sprite {}
DataClass.register(Kind,'Kind');
const This = Kind;
const Super = Sprite;

Kind._all = {};

Kind.getKind = kindName => {
	return Kind._all[kindName];
};

export default Kind;

