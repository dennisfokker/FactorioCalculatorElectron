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
        private _creationRecipes: string[] | Recipe[] = [],
        private _usedInRecipes: string[] | Recipe[] = []) { }

    public toOption(shared?: boolean, amount?: number): ItemOption
    {
        return new ItemOption(this, shared, amount);
    }

    public toString(): string
    {
        return this.name;
    }

    public addCreationRecipe(recipe: Recipe)
    {
        if (this.isStringArray(this._creationRecipes)) {
            this._creationRecipes.push(recipe.name);
        }
        else {
            this._creationRecipes.push(recipe)
        }
    }

    public addUsedInRecipe(recipe: Recipe)
    {
        if (this.isStringArray(this._usedInRecipes)) {
            this._usedInRecipes.push(recipe.name);
        }
        else {
            this._usedInRecipes.push(recipe)
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
        this._subgroup = modelService.itemSubgroups.get(this._subgroup);
    }

    public get creationRecipes(): Recipe[]
    {
        if (this.isStringArray(this._creationRecipes)) {
            return [];
        }

        return this._creationRecipes;
    }

    public get creationRecipeReferences(): string[]
    {
        if (!this.isStringArray(this._creationRecipes)) {
            return this._creationRecipes = this._creationRecipes.map(elem =>
            {
                return elem.name;
            })
        }

        return this._creationRecipes;
    }

    public loadCreationRecipes(modelService: ModelService)
    {
        if (this.isStringArray(this._creationRecipes)) {
            this._creationRecipes = this._creationRecipes.map(elem =>
            {
                return modelService.recipes.get(elem);
            })
        }
    }

    public get usedInRecipes(): Recipe[]
    {
        if (this.isStringArray(this._usedInRecipes)) {
            return [];
        }

        return this._usedInRecipes;
    }

    public get usedInRecipeReferences(): string[]
    {
        if (!this.isStringArray(this._usedInRecipes)) {
            return this._usedInRecipes = this._usedInRecipes.map(elem =>
            {
                return elem.name;
            })
        }

        return this._usedInRecipes;
    }

    public loadUsedInRecipes(modelService: ModelService)
    {
        if (this.isStringArray(this._usedInRecipes)) {
            this._usedInRecipes = this._usedInRecipes.map(elem =>
            {
                return modelService.recipes.get(elem);
            })
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length == 0) {
            return false;
        }

        return typeof (array[0]) === 'string'
    }
}
