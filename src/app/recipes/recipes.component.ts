import { RecipeCategory } from './../_models/factorio/recipeCategory';
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
    ingredients: Ingredient[] = [];
    sharedIngredients: Ingredient[] = [];

    constructor(public modelService: ModelService) { }

    ngOnInit()
    {
        const ironOreResult = new Result('Iron ore');
        const ironOreRecipe = new Recipe('Iron ore', 1, undefined, [], [ironOreResult])
        this.modelService.recipesList.push(ironOreRecipe);
        this.modelService.recipes[ironOreRecipe.name] = ironOreRecipe;
        const ironOreItem = new Item('Iron ore', new Icon('iron-ore.png'), undefined);
        this.modelService.itemsList.push(ironOreItem);
        this.modelService.items[ironOreItem.name] = ironOreItem;

        const ironResult = new Result('Iron plate');
        const ironRecipe = new Recipe('Iron plate', 1, undefined,
            [
                new Ingredient(this.modelService.items[ironOreResult.itemReference], 1, undefined, ironOreRecipe.name)
            ], [ironResult])
        this.modelService.recipesList.push(ironRecipe);
        this.modelService.recipes[ironRecipe.name] = ironRecipe;
        const ironItem = new Item('Iron plate', new Icon('iron-plate.png'), undefined);
        this.modelService.itemsList.push(ironItem);
        this.modelService.items[ironItem.name] = ironItem;

        const ironStorageBoxResult = new Result('Iron storage box');
        const ironStorageBoxRecipe = new Recipe('Iron storage box', 1, undefined,
            [
                new Ingredient(this.modelService.items[ironResult.itemReference], 1, undefined, ironRecipe.name),
                new Ingredient(this.modelService.items[ironResult.itemReference], 1, undefined, ironRecipe.name)
            ], [ironStorageBoxResult]);
        this.modelService.recipesList.push(ironStorageBoxRecipe);
        this.modelService.recipes[ironStorageBoxRecipe.name] = ironStorageBoxRecipe;
        const ironStorageBoxItem = new Item('Iron storage box', new Icon('iron-storage-box.png'), undefined);
        this.modelService.itemsList.push(ironStorageBoxItem);
        this.modelService.items[ironStorageBoxItem.name] = ironStorageBoxItem;


        const copperOreResult = new Result('Copper ore');
        const copperOreRecipe = new Recipe('Copper ore', 1, undefined, [], [copperOreResult]);
        this.modelService.recipesList.push(copperOreRecipe);
        this.modelService.recipes[copperOreRecipe.name] = copperOreRecipe;
        const copperOreItem = new Item('Copper ore', new Icon('copper-ore.png'), undefined);
        this.modelService.itemsList.push(copperOreItem);
        this.modelService.items[copperOreItem.name] = copperOreItem;

        const copperResult = new Result('Copper plate');
        const copperRecipe = new Recipe('Copper plate', 3.2, undefined,
            [
                new Ingredient(this.modelService.items[copperOreResult.itemReference], 1, undefined, copperOreRecipe.name)
            ], [copperResult]);
        this.modelService.recipesList.push(copperRecipe);
        this.modelService.recipes[copperRecipe.name] = copperRecipe;
        const copperItem = new Item('Copper plate', new Icon('copper-plate.png'), undefined);
        this.modelService.itemsList.push(copperItem);
        this.modelService.items[copperItem.name] = copperItem;

        const copperCableResult = new Result('Copper cable');
        const copperCableRecipe = new Recipe('Copper cable', 0.5, undefined,
            [
                new Ingredient(this.modelService.items[copperResult.itemReference], 2, undefined, copperRecipe.name)
            ], [copperCableResult])
        this.modelService.recipesList.push(copperCableRecipe);
        this.modelService.recipes[copperCableRecipe.name] = copperCableRecipe;
        const copperCableItem = new Item('Copper cable', new Icon('copper-cable.png'), undefined);
        this.modelService.itemsList.push(copperCableItem);
        this.modelService.items[copperCableItem.name] = copperCableItem;
        
        const circuitResult = new Result('Electronic circuit');
        const circuitRecipe = new Recipe('Electronic circuit', 0.5, undefined,
            [
                new Ingredient(this.modelService.items[ironResult.itemReference], 1, undefined, ironRecipe.name),
                new Ingredient(this.modelService.items[copperCableResult.itemReference], 3, undefined, copperCableRecipe.name)
            ], [circuitResult]);
        this.modelService.recipesList.push(circuitRecipe);
        this.modelService.recipes[circuitRecipe.name] = circuitRecipe;
        const circuitItem = new Item('Electronic circuit', new Icon('electronic-circuit.png'), undefined);
        this.modelService.itemsList.push(circuitItem);
        this.modelService.items[circuitItem.name] = circuitItem;

        this.ingredients =  [
                                new Ingredient(this.modelService.items[ironStorageBoxResult.itemReference], 1, undefined, ironStorageBoxRecipe.name),
                                new Ingredient(this.modelService.items[ironStorageBoxResult.itemReference], 1, undefined, ironStorageBoxRecipe.name)
                            ];
        this.sharedIngredients = [
                                    new Ingredient(this.modelService.items[ironStorageBoxResult.itemReference], 1, undefined, ironStorageBoxRecipe.name),
                                    new Ingredient(this.modelService.items[circuitResult.itemReference], 2, undefined, circuitRecipe.name)
                                ];
    }

}
