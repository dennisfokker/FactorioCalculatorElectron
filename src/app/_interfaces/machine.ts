import { Icon } from '../_models/Helpers/icon';
import { Indexable } from './indexable';

export interface Machine extends Indexable
{
    icon: Icon | Icon[];
    speed: number;
}
