import { ModelService } from './../../_services/model.service';
import { ItemGroup } from './ItemGroup';
import { Indexable } from 'app/_interfaces/indexable';
import { Item } from './item';


export class ItemSubgroup implements Indexable
{
    constructor(private _name: string,
        private _group: string | ItemGroup,
        private _items: string[] | Item[] = []) { }

    public toString(): string
    {
        return this.name;
    }

    public addItem(item: Item)
    {
        if (this.isStringArray(this._items)) {
            this._items.push(item.name);
        }
        else {
            this._items.push(item)
        }
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get group(): ItemGroup
    {
        if (this._group instanceof ItemGroup) {
            return this._group;
        }

        return undefined;
    }

    public get groupReference(): string
    {
        return this._group.toString();
    }

    public loadGroup(modelService: ModelService)
    {
        if (this._group instanceof ItemGroup) {
            return;
        }
        this._group = modelService.itemGroups.get(this._group);
    }

    public get items(): Item[]
    {
        if (this.isStringArray(this._items)) {
            return [];
        }

        return this._items;
    }

    public get itemReferences(): string[]
    {
        if (!this.isStringArray(this._items)) {
            return this._items = this._items.map(elem =>
            {
                return elem.name;
            })
        }

        return this._items;
    }

    public loadItems(modelService: ModelService)
    {
        if (this.isStringArray(this._items)) {
            this._items = this._items.map(elem =>
            {
                return modelService.items.get(elem);
            })
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length == 0) {
            return false;
        }

        return array[0] instanceof String
    }
}
