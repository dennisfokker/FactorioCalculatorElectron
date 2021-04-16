import { ModelService } from './../../_services/model.service';
import { ItemSubgroup } from './ItemSubgroup';
import { Icon } from '../Helpers/icon';
import { ItemOption } from './../options/itemOption';
import { Recipe } from './recipe';
import { Indexable } from '../../_interfaces/indexable';

export class Item implements Indexable
{
    constructor(private _name: string,
        private _icon: Icon | Icon[],
        private _subgroup: string | ItemSubgroup,
        private _recipes: string[] | Recipe[] = []) { }

    public toOption(shared?: boolean, amount?: number): ItemOption
    {
        return new ItemOption(this, shared, amount);
    }

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

    public get subgroup(): ItemSubgroup
    {
        if (this._subgroup instanceof ItemSubgroup) {
            return this._subgroup;
        }

        return undefined;
    }

    public get subgroupReference(): string
    {
        return this._subgroup.toString();
    }

    public loadSubgroup(modelService: ModelService)
    {
        if (this._subgroup instanceof ItemSubgroup) {
            return;
        }
        this._subgroup = modelService.itemSubgroups[this._subgroup];
    }

    public get recipes(): Recipe[]
    {
        if (this.isStringArray(this._recipes)) {
            return [];
        }

        return this._recipes;
    }

    public get recipeReferences(): string[]
    {
        if (!this.isStringArray(this._recipes)) {
            return this._recipes = this._recipes.map(elem =>
            {
                return elem.name;
            })
        }

        return this._recipes;
    }

    public loadRecipes(modelService: ModelService)
    {
        if (this.isStringArray(this._recipes)) {
            this._recipes = this._recipes.map(elem =>
            {
                return modelService.recipes[elem];
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
