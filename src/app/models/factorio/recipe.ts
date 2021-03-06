import { Indexable } from './../../interfaces/indexable';
import { Icon } from './../Helpers/icon';
import { ModelService } from './../../services/model.service';
import { Result } from './result';
import { RecipeCategory } from './recipeCategory';
import { Ingredient } from './ingredient';

export class Recipe implements Indexable
{
    constructor(private _name: string = 'Unknown',
                private _icon: Icon | Icon[],
                private _energyRequired: number = 0.5,
                private _recipeCategory: string | RecipeCategory = 'crafting',
                private _ingredients: Ingredient[] = [],
                private _results: Result[] = [])
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

    public get energyRequired(): number
    {
        return this._energyRequired;
    }

    public get recipeCategory(): RecipeCategory
    {
        if (this._recipeCategory instanceof RecipeCategory)
        {
            return this._recipeCategory;
        }

        return undefined;
    }

    public get recipeCategoryReference(): string
    {
        return this._recipeCategory.toString();
    }

    public loadRecipeCategories(modelService: ModelService)
    {
        if (this._recipeCategory instanceof RecipeCategory)
        {
            return;
        }
        this._recipeCategory = modelService.recipeCategories.get(this._recipeCategory);
    }

    public get ingredients(): Ingredient[]
    {
        return this._ingredients;
    }

    public get results(): Result[]
    {
        return this._results;
    }
    //#endregion
}
