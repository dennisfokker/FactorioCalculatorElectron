import { vector2D } from './vector2D';

export class IconData
{
    private _icon: string;
    private _tint: string;
    private _shift: vector2D;
    private _scale: number;

    constructor(icon: string,
                tint: string = "#FFFFFFFF",
                shift: vector2D = new vector2D(0, 0),
                scale: number = 1)
    {
    }
}
