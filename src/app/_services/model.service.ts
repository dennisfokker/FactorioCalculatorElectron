import { DeviceDetectorService } from 'ngx-device-detector';
import { CraftingMachine } from './../_models/factorio/craftingMachine';
import { Resource } from './../_models/factorio/resource';
import { OffshorePumpMachine } from './../_models/factorio/offshorePumpMachine';
import { MiningDrillMachine } from './../_models/factorio/miningDrillMachine';
import { IpcRequest } from '../_interfaces/ipcRequest';
import { Icon } from '../_models/Helpers/icon';
import { ItemSubgroup } from './../_models/factorio/ItemSubgroup';
import { RecipeCategory } from './../_models/factorio/recipeCategory';
import { ItemGroup } from './../_models/factorio/ItemGroup';
import { Result } from '../_models/factorio/result';
import { Ingredient } from '../_models/factorio/ingredient';
import { Injectable } from '@angular/core';
import { Item } from '../_models/factorio/item';
import { Recipe } from '../_models/factorio/recipe';
import { Subject ,  Observable } from 'rxjs';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class ModelService
{
    public factorioPath: string;
    public modsPath: string;

    public machinesChanged: Observable<CraftingMachine[]>;
    public itemsChanged: Observable<Item[]>;
    public itemGroupsChanged: Observable<ItemGroup[]>;
    public itemSubgroupsChanged: Observable<ItemSubgroup[]>;
    public recipesChanged: Observable<Recipe[]>;
    public recipeCategoriesChanged: Observable<RecipeCategory[]>;
    public miningDrillsChanged: Observable<MiningDrillMachine[]>;
    public offshorePumpsChanged: Observable<OffshorePumpMachine[]>;
    public resourcesChanged: Observable<Resource[]>;

    public machines: Map<string, CraftingMachine> = new Map<string, CraftingMachine>();
    public items: Map<string, Item> = new Map<string, Item>();
    public itemGroups: Map<string, ItemGroup> = new Map<string, ItemGroup>();
    public itemSubgroups: Map<string, ItemSubgroup> = new Map<string, ItemSubgroup>();
    public recipes: Map<string, Recipe> = new Map<string, Recipe>();
    public recipeCategories: Map<string, RecipeCategory> = new Map<string, RecipeCategory>();
    public miningDrills: Map<string, MiningDrillMachine> = new Map<string, MiningDrillMachine>();
    public offshorePumps: Map<string, OffshorePumpMachine> = new Map<string, OffshorePumpMachine>();
    public resources: Map<string, Resource> = new Map<string, Resource>();

    private machinesChangedSource: Subject<CraftingMachine[]> = new Subject<CraftingMachine[]>();
    private itemsChangedSource: Subject<Item[]> = new Subject<Item[]>();
    private itemGroupsChangedSource: Subject<ItemGroup[]> = new Subject<ItemGroup[]>();
    private itemSubgroupsChangedSource: Subject<ItemSubgroup[]> = new Subject<ItemSubgroup[]>();
    private recipesChangedSource: Subject<Recipe[]> = new Subject<Recipe[]>();
    private recipeCategoriesChangedSource: Subject<RecipeCategory[]> = new Subject<RecipeCategory[]>();
    private miningDrillsChangedSource: Subject<MiningDrillMachine[]> = new Subject<MiningDrillMachine[]>();
    private offshorePumpsChangedSource: Subject<OffshorePumpMachine[]> = new Subject<OffshorePumpMachine[]>();
    private resourcesChangedSource: Subject<Resource[]> = new Subject<Resource[]>();

    // Only used internally to link drills to resources
    private resourceCategoriesToDrills: Map<string, MiningDrillMachine[]> = new Map<string, MiningDrillMachine[]>();
    private resourceCategoriesToResources: Map<string, Resource[]> = new Map<string, Resource[]>();

    constructor(private electron: ElectronService,
                private deviceService: DeviceDetectorService)
    {
        this.machinesChanged = this.machinesChangedSource.asObservable();
        this.itemsChanged = this.itemsChangedSource.asObservable();
        this.itemGroupsChanged = this.itemGroupsChangedSource.asObservable();
        this.itemSubgroupsChanged = this.itemSubgroupsChangedSource.asObservable();
        this.recipesChanged = this.recipesChangedSource.asObservable();
        this.recipeCategoriesChanged = this.recipeCategoriesChangedSource.asObservable();
        this.miningDrillsChanged = this.miningDrillsChangedSource.asObservable();
        this.offshorePumpsChanged = this.offshorePumpsChangedSource.asObservable();
        this.resourcesChanged = this.resourcesChangedSource.asObservable();

        const request: IpcRequest = { };
        this.electron.ipcRenderer.invoke('get-paths', request).then((paths) =>
        {
            this.factorioPath = paths.factorioPath;
            this.modsPath = paths.modsPath;
        });
    }

    public updateDataFromJSON(json: any): void
    {
        // First clear old data to make sure we don't have any left-overs
        this.machines = new Map<string, CraftingMachine>();
        this.items = new Map<string, Item>();
        this.itemGroups = new Map<string, ItemGroup>();
        this.itemSubgroups = new Map<string, ItemSubgroup>();
        this.recipes = new Map<string, Recipe>();
        this.recipeCategories = new Map<string, RecipeCategory>();

        // Create and store object's given data
        this.addItemGroupsFromJSON(json['item-group']);
        this.addItemSubgroupsFromJSON(json['item-subgroup']);
        this.addItemsFromJSON(json['item']);
        this.addRecipesFromJSON(json['recipe']);
        this.addRecipeCategoriesFromJSON(json['recipe-category']);
        this.addCraftingMachinesFromJSON({ ...json['assembling-machine'], ...json['furnace']}); // join the 2 parts of the JSON that create the full set of machine data
        this.addMiningDrillsFromJSON(json['mining-drill']);
        this.addOffshorePumpsFromJSON(json['offshore-pump']);
        this.addResourcesFromJSON(json['resource']);

        // Make sure items know of their recipes and purge any that aren't used anywhere
        this.recipes.forEach(this.registerRecipeInItem, this);
        this.purgeUnusedItems();

        // Now we can finish off with the other register functions
        this.recipes.forEach(this.registerRecipeInCategory, this);
        this.items.forEach(this.registerItemInSubgroup, this);
        this.itemSubgroups.forEach(this.registerItemSubgroupInItemGroup, this);
        this.machines.forEach(this.registerCraftingMachineInRecipeCategory, this);
        this.miningDrills.forEach(this.registerMiningDrillsInResources, this);
        this.resources.forEach(this.registerResourcesInMiningDrills, this);

        this.modelDataChanged();
    }

    public updatePaths(factorioPath: string, modsPath: string): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            const pathPromises: Promise<void>[] = [];
            const factorioRequest: IpcRequest = { params: [factorioPath] };
            const modsRequest: IpcRequest = { params: [modsPath] };
            pathPromises.push(this.electron.ipcRenderer.invoke('base-path', factorioRequest));
            pathPromises.push(this.electron.ipcRenderer.invoke('mods-path', modsRequest));
            Promise.all(pathPromises).then(() =>
            {
                resolve();
            });
        });
    }

    //#region Model updating functions
    //#region adding functions
    private addItemGroupsFromJSON(itemGroupsJSON: any)
    {
        this.itemGroups = new Map(Object.values<any>(itemGroupsJSON).map(elem =>
        {
            if (elem.hasOwnProperty('icon'))
            {
                return [elem.name, new ItemGroup(elem.name, this.parseIcon(elem.icon))];
            }
            else
            {
                const icons: Icon[] = elem.icons.map(icon => this.parseIcon(icon));
                return [elem.name, new ItemGroup(elem.name, icons)];
            }
        }));
    }

    private addItemSubgroupsFromJSON(itemSubgroupsJSON: any)
    {
        this.itemSubgroups = new Map(Object.values<any>(itemSubgroupsJSON).map(elem =>
        {
            const subgroup = new ItemSubgroup(elem.name, elem.group);
            return [elem.name, subgroup];
        }));
    }

    private addItemsFromJSON(itemsJSON: any)
    {
        // Can't use map() here since we need to filter out invalid elements
        this.items = new Map(Object.values<any>(itemsJSON).reduce((result: Map<string, Item>, elem) =>
        {
            // item/fluid-unknown isn't an actual item, so skip it
            if (elem.name === 'item-unknown' || elem.name === 'fluid-unknown')
            {
                return result;
            }

            if (elem.hasOwnProperty('icon'))
            {
                const item = new Item(elem.name, this.parseIcon(elem.icon), elem.subgroup);
                result.set(elem.name, item);
            }
            else
            {
                const icons: Icon[] = elem.icons.map(icon => this.parseIcon(icon));
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

            let iconData: Icon | Icon[];
            if (elem.hasOwnProperty('icon'))
            {
                iconData = this.parseIcon(elem.icon);
            }
            else
            {
                iconData = elem.icons.map(icon => this.parseIcon(icon));
            }

            let ingredients: Ingredient[];
            if (content.ingredients instanceof Array)
            {
                ingredients = content.ingredients.map(ingredient =>
                {
                    if (ingredient instanceof Array)
                    {
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
                    if (result instanceof Array)
                    {
                        return new Result(result[0], undefined, result[1]);
                    }
                    else
                    {
                        let amount: number = content.amount;
                        if (content.hasOwnProperty('amount_min') && content.hasOwnProperty('amount_max'))
                        {
                            amount = (content.amount_min + content.amount_max) / 2;
                        }
                        return new Result(result.name, result.type, amount, result.probability);
                    }
                });
            }

            const recipe = new Recipe(elem.name, iconData, content.energy_required, elem.category, ingredients, results);
            return [elem.name, recipe];
        }));
    }

    private addRecipeCategoriesFromJSON(recipeCategoriesJSON: any)
    {
        this.recipeCategories = new Map(Object.values<any>(recipeCategoriesJSON).map(elem =>
        {
            const recipyCategory = new RecipeCategory(elem.name);
            return [elem.name, recipyCategory];
        }));
    }

    private addCraftingMachinesFromJSON(craftingMachinesJSON: any)
    {
        this.machines = new Map(Object.values<any>(craftingMachinesJSON).map(elem =>
        {
            if (elem.hasOwnProperty('icon'))
            {
                return [elem.name, new CraftingMachine(elem.name, this.parseIcon(elem.icon), elem.crafting_speed, elem.base_productivity, elem.allowed_effects, elem.crafting_categories)];
            }
            else
            {
                const icons: Icon[] = elem.icons.map(icon => this.parseIcon(icon));
                return [elem.name, new CraftingMachine(elem.name, icons, elem.crafting_speed, elem.base_productivity, elem.allowed_effects, elem.crafting_categories)];
            }
        }));
    }

    private addMiningDrillsFromJSON(miningDrillsJSON: any)
    {
        this.miningDrills = new Map(Object.values<any>(miningDrillsJSON).map(elem =>
        {
            let iconData: Icon | Icon[];
            if (elem.hasOwnProperty('icon'))
            {
                iconData = this.parseIcon(elem.icon);
            }
            else
            {
                iconData = elem.icons.map(icon => this.parseIcon(icon));
            }

            const miningDrill = new MiningDrillMachine(elem.name, iconData, elem.mining_speed, elem.base_productivity, elem.allowed_effects, elem.resource_categories);

            // Register in resource category
            for (const resourceCategory of miningDrill.resourceCategories)
            {
                const resourceCategoryMiningDrills: MiningDrillMachine[] = this.resourceCategoriesToDrills.get(resourceCategory);
                if (resourceCategoryMiningDrills)
                {
                    resourceCategoryMiningDrills.push(miningDrill);
                    this.resourceCategoriesToDrills.set(resourceCategory, resourceCategoryMiningDrills);
                }
                else
                {
                    this.resourceCategoriesToDrills.set(resourceCategory, [ miningDrill ]);
                }
            }

            return [elem.name, miningDrill];
        }));
    }

    private addOffshorePumpsFromJSON(offshorePumpsJSON: any)
    {
        this.offshorePumps = new Map(Object.values<any>(offshorePumpsJSON).map(elem =>
        {
            if (elem.hasOwnProperty('icon'))
            {
                return [elem.name, new OffshorePumpMachine(elem.name, this.parseIcon(elem.icon), elem.mining_speed, elem.fluid)];
            }
            else
            {
                const icons: Icon[] = elem.icons.map(icon => this.parseIcon(icon));
                return [elem.name, new OffshorePumpMachine(elem.name, icons, elem.crafting_speed, elem.fluid)];
            }
        }));
    }

    private addResourcesFromJSON(resourcessJSON: any)
    {
        this.resources = new Map(Object.values<any>(resourcessJSON).map(elem =>
        {
            let iconData: Icon | Icon[];
            if (elem.hasOwnProperty('icon'))
            {
                iconData = this.parseIcon(elem.icon);
            }
            else
            {
                iconData = elem.icons.map(icon => this.parseIcon(icon));
            }

            let requiredFluid: Ingredient;
            if (elem.hasOwnProperty('required_fluid'))
            {
                requiredFluid = new Ingredient(elem.required_fluid, elem.fluid_amount, 'fluid');
            }

            let results: Result[];
            if (elem.hasOwnProperty('result'))
            {
                results = [new Result(elem.result, undefined, elem.result_count)];
            }
            else
            {
                results = elem.results.map(result =>
                {
                    if (result instanceof Array)
                    {
                        return new Result(result[0], undefined, result[1]);
                    }
                    else
                    {
                        let amount: number = elem.amount;
                        if (elem.hasOwnProperty('amount_min') && elem.hasOwnProperty('amount_max'))
                        {
                            amount = (elem.amount_min + elem.amount_max) / 2;
                        }
                        return new Result(result.name, result.type, amount, result.probability);
                    }
                });
            }

            const resource = new Resource(elem.name, iconData, elem.minable, elem.category, elem.mining_time, requiredFluid, elem.result);

            // Register in resource category
            const resourceCategoryResources: Resource[] = this.resourceCategoriesToResources.get(resource.resourceCategory);
            if (resourceCategoryResources)
            {
                resourceCategoryResources.push(resource);
                this.resourceCategoriesToResources.set(resource.resourceCategory, resourceCategoryResources);
            }
            else
            {
                this.resourceCategoriesToResources.set(resource.resourceCategory, [ resource ]);
            }

            return [elem.name, resource];
        }));
    }
    //#endregion

    //#region register functions
    private registerItemSubgroupInItemGroup(subgroup: ItemSubgroup)
    {
        // Check if group already exists or not
        if (!this.itemGroups.has(subgroup.groupReference))
        {
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
        if (!this.recipeCategories.has(recipe.recipeCategoryReference))
        {
            const recipeCategory = new RecipeCategory(recipe.recipeCategoryReference, [], [recipe.name]);
            this.recipeCategories.set(recipe.recipeCategoryReference, recipeCategory);
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
            if (!this.items.has(result.itemReference))
            {
                console.error('Item "%s", which recipe "%s" uses as result, doesn\'t exist yet, so recipe cannot be registered.', result.itemReference, recipe.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const item: Item = this.items.get(result.itemReference);
            item.addCreationRecipe(recipe);
            this.items.set(result.itemReference, item);
        }
        for (const ingredient of recipe.ingredients)
        {
            // Check if item already exists or not
            if (!this.items.has(ingredient.itemReference))
            {
                console.error('Item "%s", which recipe "%s" uses as ingredient, doesn\'t exist yet, so recipe cannot be registered.', ingredient.itemReference, recipe.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const item: Item = this.items.get(ingredient.itemReference);
            item.addUsedInRecipe(recipe);
            this.items.set(ingredient.itemReference, item);
        }
    }

    private registerCraftingMachineInRecipeCategory(machine: CraftingMachine)
    {
        for (const filter of machine.recipeCategoryReferences)
        {
            // Check if item already exists or not
            if (!this.recipeCategories.has(filter))
            {
                console.error('Recipe category "%s", which crafting machine "%s" uses as filter, doesn\'t exist yet, so crafting machine cannot be registered.', filter, machine.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const category: RecipeCategory = this.recipeCategories.get(filter);
            category.addCraftingMachine(machine);
            this.recipeCategories.set(filter, category);
        }
    }

    private registerMiningDrillsInResources(miningDrill: MiningDrillMachine)
    {
        for (const resourceCategory of miningDrill.resourceCategories)
        {
            // Check if resource already exists or not
            if (!this.resourceCategoriesToResources.has(resourceCategory))
            {
                console.error('Resource category "%s", which mining drill "%s" uses as filter, doesn\'t exist yet, so mining drill cannot be registered.', resourceCategory, miningDrill.name);
                return;
            }

            // Already exists, so get it and update it in the two containers
            const recources: Resource[] = this.resourceCategoriesToResources.get(resourceCategory);
            for (const resource of recources)
            {
                resource.addMiningDrill(miningDrill);
            }
            this.resourceCategoriesToResources.set(resourceCategory, recources);
        }
    }

    private registerResourcesInMiningDrills(resource: Resource)
    {
        // Check if mining drill already exists or not
        if (!this.resourceCategoriesToDrills.has(resource.resourceCategory))
        {
            console.error('Resource category "%s", which resource "%s" uses as filter, doesn\'t exist yet, so resource cannot be registered.', resource.resourceCategory, resource.name);
            return;
        }

        // Already exists, so get it and update it in the two containers
        const miningDrills: MiningDrillMachine[] = this.resourceCategoriesToDrills.get(resource.resourceCategory);
        for (const miningDrill of miningDrills)
        {
            miningDrill.addMinableResource(resource);
        }
        this.resourceCategoriesToDrills.set(resource.resourceCategory, miningDrills);
    }
    //#endregion

    private purgeUnusedItems()
    {
        console.groupCollapsed('Purged items');

        // Keeps track of the keys to remove later
        const itemsToPurge: string[] = [];
        this.items.forEach((val: Item, key: string) =>
        {
            if (val.usedInRecipeReferences.length === 0 && val.creationRecipeReferences.length === 0)
            {
                itemsToPurge.push(key);
            }
        });

        itemsToPurge.forEach(key =>
        {
            console.warn('Purging item "%s" as it has no recipes referenced (cannot be created and isn\'t used)', key);
            this.items.delete(key);
            // NEEDS TO DO MORE BECAUSE IT'S STILL IN OTHER LISTS
        });

        console.groupEnd();
    }
    //#endregion

    //#region Helper functions for models
    private parseIcon(icon: any): Icon
    {
        if (typeof(icon) === 'string')
        {
            return new Icon(icon);
        }

        let tint;
        if (icon.hasOwnProperty('tint'))
        {
            const t = icon.tint;
            tint = {r: t.r ?? 1, g: t.g ?? 1, b: t.b ?? 1, a: t.a ?? 1};
        }

        let shift;
        if (icon.hasOwnProperty('shift'))
        {
            shift = { h: icon.shift[0], v: icon.shift[1] };
        }

        return new Icon(icon.icon, icon.icon_size, icon.scale, tint, shift);
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
