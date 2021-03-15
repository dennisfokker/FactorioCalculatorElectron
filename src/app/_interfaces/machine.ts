import { Indexable } from './indexable';

export interface Machine extends Indexable
{
    icon: IconData[];
    speed: number;
}
