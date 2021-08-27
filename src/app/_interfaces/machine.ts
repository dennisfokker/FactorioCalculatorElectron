import { MachineSubgroup } from './../_models/factorio/MachineSubgroup';
import { Icon } from '../_models/Helpers/icon';
import { Indexable } from './indexable';

export interface Machine extends Indexable
{
    icon: Icon | Icon[];
    subgroup: string | MachineSubgroup;
    speed: number;
}
