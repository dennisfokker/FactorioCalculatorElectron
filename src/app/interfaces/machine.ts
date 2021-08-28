import { MachineSubgroup } from './../models/factorio/MachineSubgroup';
import { Icon } from './../models/Helpers/icon';
import { Indexable } from './indexable';

export interface Machine extends Indexable
{
    icon: Icon | Icon[];
    subgroup: string | MachineSubgroup;
    speed: number;
}
