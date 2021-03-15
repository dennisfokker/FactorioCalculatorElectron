import { ItemGroup } from './../_models/factorio/ItemGroup';
import { Result } from '../_models/factorio/result';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Ingredient } from '../_models/factorio/ingredient';
import { Injectable } from '@angular/core';
import { Item } from '../_models/factorio/item';
import { CraftingMachine } from '../_models/factorio/craftingMachine';
import { Recipe } from '../_models/factorio/recipe';
import { Subject ,  Observable } from 'rxjs';
import { Indexable } from '../_interfaces/indexable';

@Injectable()
export class ModelService
{
    private machinesChangedSource: Subject<CraftingMachine[]> = new Subject<CraftingMachine[]>();
    private itemsChangedSource: Subject<Item[]> = new Subject<Item[]>();
    private itemGroupsChangedSource: Subject<ItemGroup[]> = new Subject<ItemGroup[]>();
    private recipesChangedSource: Subject<Recipe[]> = new Subject<Recipe[]>();
    private craftingCategoriesChangedSource: Subject<RecipeCategory[]> = new Subject<RecipeCategory[]>();

    public machinesChanged: Observable<CraftingMachine[]> = this.machinesChangedSource.asObservable();
    public itemsChanged: Observable<Item[]> = this.itemsChangedSource.asObservable();
    public itemGroupsChanged: Observable<ItemGroup[]> = this.itemGroupsChangedSource.asObservable();
    public recipesChanged: Observable<Recipe[]> = this.recipesChangedSource.asObservable();
    public craftingCategoriesChanged: Observable<RecipeCategory[]> = this.craftingCategoriesChangedSource.asObservable();

    public machinesList: CraftingMachine[] = [];
    public itemsList: Item[] = [];
    public itemGroupsList: ItemGroup[] = [];
    public recipesList: Recipe[] = [];
    public craftingCategoriesList: RecipeCategory[] = [];

    public machines: { [name: string]: CraftingMachine } = {};
    public items: { [name: string]: Item } = {};
    public itemGroups: { [name: string]: ItemGroup } = {};
    public recipes: { [name: string]: Recipe } = {};
    public craftingCategories: { [name: string]: RecipeCategory } = {};

    constructor() { }

    //#region Model updating functions
    public updateRecipesJSON(recipesJSON: any)
    {
        this.recipesList = Object.values<any>(recipesJSON).map(elem =>
        {
            let ingredients: Ingredient[] = [];
            if (elem.ingredients instanceof Array)
            {
                ingredients = elem.ingredients.map(ingredient =>
                {
                    return new Ingredient(ingredient.name, ingredient.amount, ingredient.type);
                });
            }

            let results: Result[] = [];
            if (elem.products instanceof Array)
            {
                results = elem.products.map(result =>
                {
                    const amount: number = result.hasOwnProperty('amount') ? result.amount : (result.amount_min + result.amount_max) / 2
                    return new Result(result.name, result.type, amount, result.probability);
                });
            }

            return new Recipe(elem.name, elem.energy, elem.category, ingredients, results);
        });

        this.listsChanged();
    }

    public updateFactorioPath(path: string)
    {
        //const copperOreItem = new Item('Copper ore', 'copper-ore.png');

        this.listsChanged();
    }

    public updateModsPath(path: string)
    {
        // Fill in later

        this.listsChanged();
    }
    //#endregion

    //#region Internal updating functions
    private updateDictionary<T extends Indexable>(dict: { [name: string]: T }, list: T[])
    {
        dict = {};

        list.forEach(element =>
        {
            dict[element.name] = element;
        });
    }

    private listsChanged()
    {
        this.updateDictionary(this.machines, this.machinesList);
        this.machinesChangedSource.next(this.machinesList);
        this.updateDictionary(this.items, this.itemsList);
        this.itemsChangedSource.next(this.itemsList);
        this.updateDictionary(this.itemGroups, this.itemGroupsList);
        this.itemGroupsChangedSource.next(this.itemGroupsList);
        this.updateDictionary(this.recipes, this.recipesList);
        this.recipesChangedSource.next(this.recipesList);
        this.updateDictionary(this.craftingCategories, this.craftingCategoriesList);
        this.craftingCategoriesChangedSource.next(this.craftingCategoriesList);
    }
    //#endregion
}
