import { ModelService } from './../../_services/model.service';
import { Item } from './item';

export class Result
{
    constructor(private _item: string | Item = 'Unknown',
        private _type: string = 'item',
        private _amount: number = 1,
        private _probability: number = 1) { }

    public toString(): string
    {
        if (this.item instanceof Item) {
            return this.item.name;
        }
        return this.item;
    }

    //#region Getters and Setters
    public get item(): Item
    {
        if (this._item instanceof Item) {
            return this._item;
        }

        return undefined;
    }

    public get itemReference(): string
    {
        return this._item.toString();
    }

    public loadItem(modelService: ModelService)
    {
        if (this._item instanceof Item) {
            return;
        }
        this._item = modelService.items[this._item];
    }

    public get type(): string
    {
        return this._type;
    }

    public get amount(): number
    {
        return this._amount;
    }

    public get probability(): number
    {
        return this._probability;
    }
    //#endregion
}
