import { Indexable } from './../../interfaces/indexable';
import { ItemSubgroup } from './ItemSubgroup';
import { Icon } from '../Helpers/icon';
import { ModelService } from './../../services/model.service';
import { ItemOption } from './../options/itemOption';
import { ItemGroupOption } from './../options/itemGroupOption';

export class ItemGroup implements Indexable
{
    constructor(private _name: string,
                private _icon: Icon | Icon[],
                private _subgroups: string[] | ItemSubgroup[] = [])
    { }

    public toOption(modelService: ModelService): ItemGroupOption
    {
        let itemOptions: ItemOption[] = [];
        this.loadSubgroups(modelService);
        for (const subgroup of this.subgroups)
        {
            subgroup.loadItems(modelService);
            itemOptions = itemOptions.concat(subgroup.items.map((item) => item.toOption()));
        }

        return new ItemGroupOption(this, itemOptions);
    }

    public toString(): string
    {
        return this.name;
    }

    public addSubgroup(subgroup: ItemSubgroup)
    {
        if (this.isStringArray(this._subgroups))
        {
            this._subgroups.push(subgroup.name);
        }
        else
        {
            this._subgroups.push(subgroup);
        }
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

    public get subgroups(): ItemSubgroup[]
    {
        if (this.isStringArray(this._subgroups))
        {
            return [];
        }

        return this._subgroups;
    }

    public get subgroupReferences(): string[]
    {
        if (!this.isStringArray(this._subgroups))
        {
            return this._subgroups = this._subgroups.map(elem => elem.name);
        }

        return this._subgroups;
    }

    public loadSubgroups(modelService: ModelService)
    {
        if (this.isStringArray(this._subgroups))
        {
            this._subgroups = this._subgroups.map(elem => modelService.itemSubgroups.get(elem));
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length === 0)
        {
            return false;
        }

        return typeof (array[0]) === 'string';
    }
}
