import { Icon } from '../_models/Helpers/icon';
import { ItemSubgroup } from './../_models/factorio/ItemSubgroup';
import { RecipeCategory } from './../_models/factorio/recipeCategory';
import { ItemGroup } from './../_models/factorio/ItemGroup';
import { Result } from '../_models/factorio/result';
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
    private itemSubgroupsChangedSource: Subject<ItemSubgroup[]> = new Subject<ItemSubgroup[]>();
    private recipesChangedSource: Subject<Recipe[]> = new Subject<Recipe[]>();
    private recipeCategoriesChangedSource: Subject<RecipeCategory[]> = new Subject<RecipeCategory[]>();

    public machinesChanged: Observable<CraftingMachine[]> = this.machinesChangedSource.asObservable();
    public itemsChanged: Observable<Item[]> = this.itemsChangedSource.asObservable();
    public itemGroupsChanged: Observable<ItemGroup[]> = this.itemGroupsChangedSource.asObservable();
    public itemSubgroupsChanged: Observable<ItemSubgroup[]> = this.itemSubgroupsChangedSource.asObservable();
    public recipesChanged: Observable<Recipe[]> = this.recipesChangedSource.asObservable();
    public recipeCategoriesChanged: Observable<RecipeCategory[]> = this.recipeCategoriesChangedSource.asObservable();

    public machinesList: CraftingMachine[] = [];
    public itemsList: Item[] = [];
    public itemGroupsList: ItemGroup[] = [];
    public itemSubgroupsList: ItemSubgroup[] = [];
    public recipesList: Recipe[] = [];
    public recipeCategoriesList: RecipeCategory[] = [];

    public machines: { [name: string]: CraftingMachine } = {};
    public items: { [name: string]: Item } = {};
    public itemGroups: { [name: string]: ItemGroup } = {};
    public itemSubgroups: { [name: string]: ItemSubgroup } = {};
    public recipes: { [name: string]: Recipe } = {};
    public recipeCategories: { [name: string]: RecipeCategory } = {};

    constructor() { }

    public updateDataFromJSON(JSON: any) : void
    {
        this.updateRecipesFromJSON(JSON.recipe);
        this.updateItemsFromJSON(JSON.item);

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

    //#region Model updating functions
    private updateRecipesFromJSON(recipesJSON: any)
    {
        this.recipesList = Object.values<any>(recipesJSON).map(elem =>
        {
            const content: any = elem.hasOwnProperty('normal') ? elem.normal : elem;

            let ingredients: Ingredient[] = [];
            if (content.ingredients instanceof Array)
            {
                content.ingredients.map(ingredient =>
                {
                    if (ingredient instanceof Array) {
                        return new Ingredient(ingredient[0], ingredient[1]);
                    }
                    return new Ingredient(ingredient.name, ingredient.amount, ingredient.type);
                });
            }

            let results: Result[];
            if (content.hasOwnProperty('result'))
            {
                results = [new Result(content.result, undefined, content.result_count)];
            }
            else
            {
                results = content.results.map(result =>
                {
                    let amount: number = content.amount;
                    if (content.hasOwnProperty('amount_min') && content.hasOwnProperty('amount_max')) {
                        amount = (content.amount_min + content.amount_max) / 2;
                    }
                    return new Result(result.name, result.type, amount, result.probability);
                });
            }

            return new Recipe(elem.name, content.energy_required, elem.category, ingredients, results);
        });
    }

    private updateItemsFromJSON(itemsJSON: any)
    {
        this.itemsList = Object.values<any>(itemsJSON).map(elem =>
        {
            if (elem.hasOwnProperty('icon'))
            {
                return new Item(elem.name, this.parseIcon(elem.icon), elem.subgroup);
            }
            else
            {
                const icons: Icon[] = elem.icons.map(icon =>
                {
                    return this.parseIcon(icon);
                })
                return new Item(elem.name, icons, elem.subgroup);
            }
        });
    }
    //#endregion

    //#region Helper functions for models
    private parseIcon(icon: any): Icon
    {
        let tint = undefined;
        if (icon.hasOwnProperty('tint'))
        {
            const t = icon.tint;
            tint = {r: t.r ?? 1, g: t.g ?? 1, b: t.b ?? 1, a: t.a ?? 1}
        }

        let shift = undefined;
        if (icon.hasOwnProperty('shift')) {
            shift = { h: icon.shift[0], v: icon.shift[1] }
        }

        return new Icon(icon.icon, icon.icon_size, icon.scale, tint, shift)
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
        this.updateDictionary(this.itemSubgroups, this.itemSubgroupsList);
        this.itemSubgroupsChangedSource.next(this.itemSubgroupsList);
        this.updateDictionary(this.recipes, this.recipesList);
        this.recipesChangedSource.next(this.recipesList);
        this.updateDictionary(this.recipeCategories, this.recipeCategoriesList);
        this.recipeCategoriesChangedSource.next(this.recipeCategoriesList);
    }
    //#endregion
}
