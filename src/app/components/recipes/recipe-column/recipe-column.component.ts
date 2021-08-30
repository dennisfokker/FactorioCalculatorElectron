import { ItemOptionsService } from './../../../services/item-options.service';
import { Ingredient } from './../../../models/factorio/ingredient';
import { Item } from './../../../models/factorio/item';
import { Icon } from './../../../models/Helpers/icon';
import { Recipe } from './../../../models/factorio/recipe';
import { ModelService } from './../../../services/model.service';
import { Result } from './../../../models/factorio/result';
import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
    selector: 'app-recipe-column',
    templateUrl: './recipe-column.component.html',
    styleUrls: ['./recipe-column.component.css']
})
export class RecipeColumnComponent implements OnInit
{
    recipeResults: Map<string, Result> = new Map<string, Result>();
    sharedRecipeResults: Map<string, Result> = new Map<string, Result>();

    constructor(private modelService: ModelService,
                private itemOptionsService: ItemOptionsService)
    { }

    ngOnInit()
    {
        this.loadInMockData();

        this.itemOptionsService.nonSharedItemAdded$.subscribe((addedItemOption) =>
        {
            this.recipeResults.set(addedItemOption.item.name, new Result(addedItemOption.item, undefined, addedItemOption.amount));
        });
        this.itemOptionsService.nonSharedItemRemoved$.subscribe((addedItemOption) =>
        {
            this.recipeResults.delete(addedItemOption.item.name);
        });
        this.itemOptionsService.nonSharedItemUpdated$.subscribe((addedItemOption) =>
        {
            const currentResult: Result = this.recipeResults.get(addedItemOption.newItemOption.item.name);
            this.recipeResults.set(addedItemOption.newItemOption.item.name, new Result(currentResult.item, currentResult.type, addedItemOption.newItemOption.amount, currentResult.probability, currentResult.recipe));
        });

        this.itemOptionsService.sharedItemAdded$.subscribe((addedItemOption) =>
        {
            this.sharedRecipeResults.set(addedItemOption.item.name, new Result(addedItemOption.item, undefined, addedItemOption.amount));
        });
        this.itemOptionsService.sharedItemRemoved$.subscribe((addedItemOption) =>
        {
            this.sharedRecipeResults.delete(addedItemOption.item.name);
        });
        this.itemOptionsService.sharedItemUpdated$.subscribe((addedItemOption) =>
        {
            const currentResult: Result = this.sharedRecipeResults.get(addedItemOption.newItemOption.item.name);
            this.sharedRecipeResults.set(addedItemOption.newItemOption.item.name, new Result(currentResult.item, currentResult.type, addedItemOption.newItemOption.amount, currentResult.probability, currentResult.recipe));
        });
    }

    public trackRecipeNode(index: number, item: KeyValue<string, Result>)
    {
        return item.key;
    }

    private loadInMockData(): void
    {
        const ironOreResult = new Result('Iron ore');
        const ironOreRecipe = new Recipe('Iron ore', new Icon('__internal__/iron-ore.png'), 1, undefined, [], [ironOreResult]);
        this.modelService.recipes.set(ironOreRecipe.name, ironOreRecipe);
        const ironOreItem = new Item('Iron ore', new Icon('__internal__/iron-ore.png'), undefined);
        this.modelService.items.set(ironOreItem.name, ironOreItem);

        const ironResult = new Result('Iron plate');
        const ironRecipe = new Recipe('Iron plate', new Icon('__internal__/iron-plate.png'), 1, undefined,
                                      [
                                          new Ingredient(this.modelService.items.get(ironOreResult.itemReference), 1)
                                      ], [ironResult]);
        this.modelService.recipes.set(ironRecipe.name, ironRecipe);
        const ironItem = new Item('Iron plate', new Icon('__internal__/iron-plate.png'), undefined);
        ironItem.addCreationRecipe(ironRecipe);
        this.modelService.items.set(ironItem.name, ironItem);

        const ironStorageBoxResult = new Result('Iron storage box', 'item', 1, 1, 'Iron storage box');
        const ironStorageBoxRecipe = new Recipe('Iron storage box', new Icon('__internal__/iron-storage-box.png'), 1, undefined,
                                                [
                                                    new Ingredient(this.modelService.items.get(ironResult.itemReference), 1),
                                                    new Ingredient(this.modelService.items.get(ironResult.itemReference), 3.5)
                                                ], [ironStorageBoxResult]);
        this.modelService.recipes.set(ironStorageBoxRecipe.name, ironStorageBoxRecipe);
        const ironStorageBoxItem = new Item('Iron storage box', new Icon('__internal__/iron-storage-box.png'), undefined);
        ironStorageBoxItem.addCreationRecipe(ironStorageBoxRecipe);
        this.modelService.items.set(ironStorageBoxItem.name, ironStorageBoxItem);


        const copperOreResult = new Result('Copper ore');
        const copperOreRecipe = new Recipe('Copper ore', new Icon('__internal__/copper-ore.png'), 1, undefined, [], [copperOreResult]);
        this.modelService.recipes.set(copperOreRecipe.name, copperOreRecipe);
        const copperOreItem = new Item('Copper ore', new Icon('__internal__/copper-ore.png'), undefined);
        this.modelService.items.set(copperOreItem.name, copperOreItem);

        const copperResult = new Result('Copper plate');
        const copperRecipe = new Recipe('Copper plate', new Icon('__internal__/copper-plate.png'), 3.2, undefined,
                                        [
                                            new Ingredient(this.modelService.items.get(copperOreResult.itemReference), 1)
                                        ], [copperResult]);
        this.modelService.recipes.set(copperRecipe.name, copperRecipe);
        const copperItem = new Item('Copper plate', new Icon('__internal__/copper-plate.png'), undefined);
        copperItem.addCreationRecipe(copperRecipe);
        this.modelService.items.set(copperItem.name, copperItem);

        const copperCableResult = new Result('Copper cable', 'item', 2);
        const copperCableRecipe = new Recipe('Copper cable', new Icon('__internal__/copper-cable.png'), 0.5, undefined,
                                             [
                                                 new Ingredient(this.modelService.items.get(copperResult.itemReference), 1)
                                             ], [copperCableResult]);
        this.modelService.recipes.set(copperCableRecipe.name, copperCableRecipe);
        const copperCableItem = new Item('Copper cable', new Icon('__internal__/copper-cable.png'), undefined);
        copperCableItem.addCreationRecipe(copperCableRecipe);
        this.modelService.items.set(copperCableItem.name, copperCableItem);

        const circuitResult = new Result('Electronic circuit', 'item', 1, 1, 'Electronic circuit');
        const circuitRecipe = new Recipe('Electronic circuit', new Icon('__internal__/electronic-circuit.png'), 0.5, undefined,
                                         [
                                             new Ingredient(this.modelService.items.get(ironResult.itemReference), 1),
                                             new Ingredient(this.modelService.items.get(copperCableResult.itemReference), 3)
                                         ], [circuitResult]);
        this.modelService.recipes.set(circuitRecipe.name, circuitRecipe);
        const circuitItem = new Item('Electronic circuit', new Icon('__internal__/electronic-circuit.png'), undefined);
        circuitItem.addCreationRecipe(circuitRecipe);
        this.modelService.items.set(circuitItem.name, circuitItem);

        this.recipeResults.set('Iron storage box', new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe));
        this.recipeResults.set('Iron storage box-copy', new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe));
        this.sharedRecipeResults.set('Iron storage box', new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe));
        this.sharedRecipeResults.set('Electronic circuit', new Result('Electronic circuit', 'item', 5, 1, circuitRecipe));
    }
}
