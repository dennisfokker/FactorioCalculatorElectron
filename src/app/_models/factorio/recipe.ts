import { ModelService } from './../../_services/model.service';
import { Result } from './result';
import { RecipeCategory } from './recipeCategory';
import { Ingredient } from './ingredient';
import { Indexable } from '../../_interfaces/indexable';

export class Recipe implements Indexable
{
    constructor(private _name: string = 'Unknown',
        private _energyRequired: number = 0.5,
        private _recipeCategory: string | RecipeCategory,
        private _ingredients: Ingredient[] = [],
        private _results: Result[] = []) { }

    public toString(): string
    {
        return this.name;
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get energyRequired(): number
    {
        return this._energyRequired;
    }

    public get recipeCategory(): RecipeCategory
    {
        if (this._recipeCategory instanceof RecipeCategory) {
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
        if (this._recipeCategory instanceof RecipeCategory) {
            return;
        }
        this._recipeCategory = modelService.recipeCategories[this._recipeCategory];
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
