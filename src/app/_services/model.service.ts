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

    public machines: Map<string, CraftingMachine> = new Map<string, CraftingMachine>();
    public items: Map<string, Item> = new Map<string, Item>();
    public itemGroups: Map<string, ItemGroup> = new Map<string, ItemGroup>();
    public itemSubgroups: Map<string, ItemSubgroup> = new Map<string, ItemSubgroup>();
    public recipes: Map<string, Recipe> = new Map<string, Recipe>();
    public recipeCategories: Map<string, RecipeCategory> = new Map<string, RecipeCategory>();

    constructor() { }

    public updateDataFromJSON(JSON: any) : void
    {
        // First clear old data to make sure we don't have any left-overs
        this.machines = new Map<string, CraftingMachine>();
        this.items = new Map<string, Item>();
        this.itemGroups = new Map<string, ItemGroup>();
        this.itemSubgroups = new Map<string, ItemSubgroup>();
        this.recipes = new Map<string, Recipe>();
        this.recipeCategories = new Map<string, RecipeCategory>();
        
        // Create and store object's given data
        this.addItemGroupsFromJSON(JSON['item-group'])
        this.addItemSubgroupsFromJSON(JSON['item-subgroup'])
        this.addItemsFromJSON(JSON['item']);
        this.addRecipesFromJSON(JSON['recipe']);

        // Make sure items know of their recipes and purge any that aren't used anywhere
        this.recipes.forEach(this.registerRecipeInItem, this);
        this.purgeUnusedItems();

        // Now we can finish off with the other register functions
        this.recipes.forEach(this.registerRecipeInCategory, this);
        this.items.forEach(this.registerItemInSubgroup, this);
        this.itemSubgroups.forEach(this.registerItemSubgroupInItemGroup, this);

        this.modelDataChanged();
    }

    public updateFactorioPath(path: string)
    {


        this.modelDataChanged();
    }

    public updateModsPath(path: string)
    {
        // Fill in later

        this.modelDataChanged();
    }

    //#region Model updating functions
    private addItemGroupsFromJSON(itemGroupsJSON: any)
    {
        this.itemGroups = new Map(Object.values<any>(itemGroupsJSON).map(elem => {
            if (elem.hasOwnProperty('icon')) {
                return [elem.name, new ItemGroup(elem.name, this.parseIcon(elem.icon))];
            }
            else {
                const icons: Icon[] = elem.icons.map(icon =>
                {
                    return this.parseIcon(icon);
                })
                return [elem.name, new ItemGroup(elem.name, icons)];
            }
        }))
    }

    private addItemSubgroupsFromJSON(itemSubgroupsJSON: any)
    {
        this.itemSubgroups = new Map(Object.values<any>(itemSubgroupsJSON).map(elem =>
        {
            const subgroup = new ItemSubgroup(elem.name, elem.group);
            return [elem.name, subgroup];
        }))
    }

    private addItemsFromJSON(itemsJSON: any)
    {
        // Can't use map() here since we need to filter out a single element
        this.items = new Map(Object.values<any>(itemsJSON).reduce((result: Map<string, Item>, elem) =>
        {
            // item-unknown isn't an actual item, so skip it
            if (elem.name === 'item-unknown') {
                return result;
            }

            if (elem.hasOwnProperty('icon')) {
                const item = new Item(elem.name, this.parseIcon(elem.icon), elem.subgroup);
                result.set(elem.name, item);
            }
            else {
                const icons: Icon[] = elem.icons.map(icon =>
                {
                    return this.parseIcon(icon);
                })
                const item = new Item(elem.name, icons, elem.subgroup);
                result.set(elem.name, item);
            }
            return result;
        }, new Map()));
    }

    private addRecipesFromJSON(recipesJSON: any)
    {
        this.recipes = new Map(Object.values<any>(recipesJSON).map(elem =>
        {
            const content: any = elem.hasOwnProperty('normal') ? elem.normal : elem;

            let ingredients: Ingredient[];
            if (content.ingredients instanceof Array)
            {
                ingredients = content.ingredients.map(ingredient =>
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
                    if (result instanceof Array) {
                        return new Result(result[0], undefined, result[1]);
                    }
                    else
                    {
                        let amount: number = content.amount;
                        if (content.hasOwnProperty('amount_min') && content.hasOwnProperty('amount_max')) {
                            amount = (content.amount_min + content.amount_max) / 2;
                        }
                        return new Result(result.name, result.type, amount, result.probability);
                    }
                });
            }

            const recipe = new Recipe(elem.name, content.energy_required, elem.category, ingredients, results)
            return [elem.name, recipe];
        }));
    }

    private registerItemSubgroupInItemGroup(subgroup: ItemSubgroup)
    {
        // Check if group already exists or not
        if (!this.itemGroups.has(subgroup.groupReference)) {
            console.error('Item group "%s" for item subgroup "%s" doesn\'t exist yet, so item cannot be registered.', subgroup.groupReference, subgroup.name);
            return;
        }

        // Already exists, so get it and update it in the two containers
        const group: ItemGroup = this.itemGroups.get(subgroup.groupReference);
        group.addSubgroup(subgroup);
        this.itemGroups.set(subgroup.groupReference, group);
    }

    private registerItemInSubgroup(item: Item)
    {
        // Check if item already exists or not
        if (!this.itemSubgroups.has(item.subgroupReference))
        {
            console.error('Item subgroup "%s" for item "%s" doesn\'t exist yet, so item cannot be registered.', item.subgroupReference, item.name);
            return;
        }

        // Already exists, so get it and update it in the two containers
        const subgroup: ItemSubgroup = this.itemSubgroups.get(item.subgroupReference);
        subgroup.addItem(item);
        this.itemSubgroups.set(item.subgroupReference, subgroup);
    }

    private registerRecipeInCategory(recipe: Recipe)
    {
        // Check if category already exists or not
        if (!this.recipeCategories.has(recipe.recipeCategoryReference)) {
            const category = new RecipeCategory(recipe.recipeCategoryReference, [], [recipe.name])
            this.recipeCategories.set(recipe.recipeCategoryReference, category);
            return;
        }

        // Already exists, so get it and update it in the two containers
        const category: RecipeCategory = this.recipeCategories.get(recipe.recipeCategoryReference);
        category.addRecipe(recipe);
        this.recipeCategories.set(recipe.recipeCategoryReference, category);
    }

    private registerRecipeInItem(recipe: Recipe)
    {
        for (const result of recipe.results)
        {
            // Check if item already exists or not
            if (!this.items.has(result.itemReference)) {
                console.error('Item "%s", which recipe "%s" uses as result, doesn\'t exist yet, so recipe cannot be registered.', result.itemReference, recipe.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const item: Item = this.items.get(result.itemReference);
            item.addCreationRecipe(recipe);
            this.items.set(result.itemReference, item);
        }
        for (const ingredient of recipe.ingredients) {
            // Check if item already exists or not
            if (!this.items.has(ingredient.itemReference)) {
                console.error('Item "%s", which recipe "%s" uses as ingredient, doesn\'t exist yet, so recipe cannot be registered.', ingredient.itemReference, recipe.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const item: Item = this.items.get(ingredient.itemReference);
            item.addUsedInRecipe(recipe);
            this.items.set(ingredient.itemReference, item);
        }
    }

    private purgeUnusedItems()
    {
        // Keeps track of the keys to remove later
        const itemsToPurge: string[] = [];
        this.items.forEach((val: Item, key: string) =>
        {
            if (val.usedInRecipeReferences.length == 0 && val.creationRecipeReferences.length == 0)
            {
                itemsToPurge.push(key);
            }
        });

        itemsToPurge.forEach(key =>
        {
            console.warn('Purging item "%s" as it has no recipes referenced (cannot be created and isn\'t used)', key)
            this.items.delete(key);
            // NEEDS TO DO MORE BECAUSE IT'S STILL IN OTHER LISTS
        });
    }
    //#endregion

    //#region Helper functions for models
    private parseIcon(icon: any): Icon
    {
        if (typeof(icon) === 'string')
        {
            return new Icon(icon);
        }

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
    private modelDataChanged()
    {
        this.machinesChangedSource.next(Array.from(this.machines.values()));
        this.itemsChangedSource.next(Array.from(this.items.values()));
        this.itemGroupsChangedSource.next(Array.from(this.itemGroups.values()));
        this.itemSubgroupsChangedSource.next(Array.from(this.itemSubgroups.values()));
        this.recipesChangedSource.next(Array.from(this.recipes.values()));
        this.recipeCategoriesChangedSource.next(Array.from(this.recipeCategories.values()));
    }
    //#endregion
}
