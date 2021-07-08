import { Component, OnInit } from '@angular/core';
import { Recipe } from '../_models/factorio/recipe';
import { Item } from '../_models/factorio/item';
import { Result } from '../_models/factorio/result';
import { Ingredient } from '../_models/factorio/ingredient';
import { ModelService } from '../_services/model.service';
import { Icon } from 'app/_models/Helpers/icon';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit
{
    recipeResults: Result[] = [];
    sharedRecipeResults: Result[] = [];

    constructor(public modelService: ModelService)
    { }

    ngOnInit()
    {
        const ironOreResult = new Result('Iron ore');
        const ironOreRecipe = new Recipe('Iron ore', 1, undefined, [], [ironOreResult]);
        this.modelService.recipes.set(ironOreRecipe.name, ironOreRecipe);
        const ironOreItem = new Item('Iron ore', new Icon('__internal__/iron-ore.png'), undefined);
        this.modelService.items.set(ironOreItem.name, ironOreItem);

        const ironResult = new Result('Iron plate');
        const ironRecipe = new Recipe('Iron plate', 1, undefined,
                                      [
                                          new Ingredient(this.modelService.items.get(ironOreResult.itemReference), 1)
                                      ], [ironResult]);
        this.modelService.recipes.set(ironRecipe.name, ironRecipe);
        const ironItem = new Item('Iron plate', new Icon('__internal__/iron-plate.png'), undefined);
        ironItem.addCreationRecipe(ironRecipe);
        this.modelService.items.set(ironItem.name, ironItem);

        const ironStorageBoxResult = new Result('Iron storage box', 'item', 1, 1, 'Iron storage box');
        const ironStorageBoxRecipe = new Recipe('Iron storage box', 1, undefined,
                                                [
                                                    new Ingredient(this.modelService.items.get(ironResult.itemReference), 1),
                                                    new Ingredient(this.modelService.items.get(ironResult.itemReference), 3.5)
                                                ], [ironStorageBoxResult]);
        this.modelService.recipes.set(ironStorageBoxRecipe.name, ironStorageBoxRecipe);
        const ironStorageBoxItem = new Item('Iron storage box', new Icon('__internal__/iron-storage-box.png'), undefined);
        ironStorageBoxItem.addCreationRecipe(ironStorageBoxRecipe);
        this.modelService.items.set(ironStorageBoxItem.name, ironStorageBoxItem);


        const copperOreResult = new Result('Copper ore');
        const copperOreRecipe = new Recipe('Copper ore', 1, undefined, [], [copperOreResult]);
        this.modelService.recipes.set(copperOreRecipe.name, copperOreRecipe);
        const copperOreItem = new Item('Copper ore', new Icon('__internal__/copper-ore.png'), undefined);
        this.modelService.items.set(copperOreItem.name, copperOreItem);

        const copperResult = new Result('Copper plate');
        const copperRecipe = new Recipe('Copper plate', 3.2, undefined,
                                        [
                                            new Ingredient(this.modelService.items.get(copperOreResult.itemReference), 1)
                                        ], [copperResult]);
        this.modelService.recipes.set(copperRecipe.name, copperRecipe);
        const copperItem = new Item('Copper plate', new Icon('__internal__/copper-plate.png'), undefined);
        copperItem.addCreationRecipe(copperRecipe);
        this.modelService.items.set(copperItem.name, copperItem);

        const copperCableResult = new Result('Copper cable', 'item', 2);
        const copperCableRecipe = new Recipe('Copper cable', 0.5, undefined,
                                             [
                                                 new Ingredient(this.modelService.items.get(copperResult.itemReference), 1)
                                             ], [copperCableResult]);
        this.modelService.recipes.set(copperCableRecipe.name, copperCableRecipe);
        const copperCableItem = new Item('Copper cable', new Icon('__internal__/copper-cable.png'), undefined);
        copperCableItem.addCreationRecipe(copperCableRecipe);
        this.modelService.items.set(copperCableItem.name, copperCableItem);

        const circuitResult = new Result('Electronic circuit', 'item', 1, 1, 'Electronic circuit');
        const circuitRecipe = new Recipe('Electronic circuit', 0.5, undefined,
                                         [
                                             new Ingredient(this.modelService.items.get(ironResult.itemReference), 1),
                                             new Ingredient(this.modelService.items.get(copperCableResult.itemReference), 3)
                                         ], [circuitResult]);
        this.modelService.recipes.set(circuitRecipe.name, circuitRecipe);
        const circuitItem = new Item('Electronic circuit', new Icon('__internal__/electronic-circuit.png'), undefined);
        circuitItem.addCreationRecipe(circuitRecipe);
        this.modelService.items.set(circuitItem.name, circuitItem);

        this.recipeResults = [
            new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe),
            new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe)
        ];
        this.sharedRecipeResults = [
            new Result('Iron storage box', 'item', 1, 1, ironStorageBoxRecipe),
            new Result('Electronic circuit', 'item', 5, 1, circuitRecipe)
        ];
    }

}
