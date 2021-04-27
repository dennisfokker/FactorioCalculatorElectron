import { ModelService } from './../../_services/model.service';
import { Recipe } from './recipe';
import { CraftingMachine } from './craftingMachine';
import { Indexable } from '../../_interfaces/indexable';

export class RecipeCategory implements Indexable
{
    constructor(private _name: string = 'Unknown',
        private _craftingMachines: string[] | CraftingMachine[] = [],
        private _recipes: string[] | Recipe[] = []) { }

    public toString(): string
    {
        return this.name;
    }

    public addCraftingMachine(craftingMachine: CraftingMachine)
    {
        if (this.isStringArray(this._craftingMachines)) {
            this._craftingMachines.push(craftingMachine.name);
        }
        else
        {
            this._craftingMachines.push(craftingMachine)
        }
    }

    public addRecipe(recipe: Recipe)
    {
        if (this.isStringArray(this._recipes)) {
            this._recipes.push(recipe.name);
        }
        else {
            this._recipes.push(recipe)
        }
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get craftingMachines(): CraftingMachine[]
    {
        if (this.isStringArray(this._craftingMachines)) {
            return [];
        }

        return this._craftingMachines;
    }

    public get craftingMachineReferences(): string[]
    {
        if (!this.isStringArray(this._craftingMachines)) {
            return this._craftingMachines = this._craftingMachines.map(elem =>
            {
                return elem.name;
            })
        }

        return this._craftingMachines;
    }

    public loadCraftingMachines(modelService: ModelService)
    {
        if (this.isStringArray(this._craftingMachines)) {
            this._craftingMachines = this._craftingMachines.map(elem =>
            {
                return modelService.machines.get(elem);
            })
        }
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

        return array[0] instanceof String
    }
}
