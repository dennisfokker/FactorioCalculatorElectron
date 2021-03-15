import { vector2D } from './vector2D';

export class IconData
{
    constructor(public icon: string,
                public tint: string = "#FFFFFFFF",
                public shift: vector2D = new vector2D(0, 0),
                public scale: number = 1)
    {
    }

    toString(): string
    {
        return this.icon;
    }
}
