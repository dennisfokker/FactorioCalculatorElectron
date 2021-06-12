import { ModelService } from './../../_services/model.service';
import { Item } from './item';
import { Icon } from '../Helpers/icon';
import { Machine } from '../../_interfaces/machine';

export class OffshorePumpMachine implements Machine
{
    constructor(private _name: string,
                private _icon: Icon | Icon[],
                private _speed: number = 1,
                private _output: string | Item = 'Unknown')
    { }

    public toString(): string
    {
        return this.name;
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get icon(): Icon | Icon[]
    {
        return this._icon;
    }

    public get speed(): number
    {
        return this._speed;
    }

    public get output(): Item
    {
        if (this._output instanceof Item)
        {
            return this._output;
        }

        return undefined;
    }

    public get outputReference(): string
    {
        return this._output.toString();
    }

    public loadOutput(modelService: ModelService)
    {
        if (this._output instanceof Item)
        {
            return;
        }
        this._output = modelService.items.get(this._output);
    }
    //#endregion
}
