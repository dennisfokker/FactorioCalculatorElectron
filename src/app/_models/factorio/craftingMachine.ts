import { ModelService } from '../../_services/model.service';
import { Icon } from '../Helpers/icon';
import { EffectType } from '../../_types/effectType';
import { RecipeCategory } from './recipeCategory';
import { Machine } from '../../_interfaces/machine';

export class CraftingMachine implements Machine
{
    constructor(private _name: string,
                private _icon: Icon | Icon[],
                private _speed: number = 1,
                private _production: number = 0,
                private _allowedEffects: EffectType[] = ['speed', 'productivity', 'consumption', 'pollution'],
                private _recipeCategories: string[] | RecipeCategory[] = [])
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

    public get production(): number
    {
        return this._production;
    }

    public get allowedEffects(): EffectType[]
    {
        return this._allowedEffects;
    }

    public get recipeCategories(): RecipeCategory[]
    {
        if (this.isStringArray(this._recipeCategories))
        {
            return [];
        }

        return this._recipeCategories;
    }

    public get recipeCategorieReferences(): string[]
    {
        if (!this.isStringArray(this._recipeCategories))
        {
            return this._recipeCategories = this._recipeCategories.map(elem => elem.name);
        }

        return this._recipeCategories;
    }

    public loadRecipeCategories(modelService: ModelService)
    {
        if (this.isStringArray(this._recipeCategories))
        {
            this._recipeCategories = this._recipeCategories.map(elem => modelService.recipeCategories.get(elem));
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length === 0)
        {
            return false;
        }

        return typeof(array[0]) === 'string';
    }
}
