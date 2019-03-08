
import DataClass, {getType, nonce} from '../base/data/DataClass';

class Card extends DataClass {}
DataClass.register(Card, 'Card');
const This = Card;

export default Card;
