import { ModelService } from './../../_services/model.service';
import { Recipe } from './recipe';
import { Item } from './item';

export class Ingredient
{
    constructor(private _item: string | Item,
        private _amount: number = 1,
        private _type: string = 'item',
        private _recipe?: string | Recipe) { }

    public toString(): string
    {
        if (this.item instanceof Item)
        {
            return this.item.name;
        }
        return this.item;
    }

    //#region Getters and Setters
    public get item(): Item
    {
        if (this._item instanceof Item) {
            return this._item;
        }

        return undefined;
    }

    public get itemReference(): string
    {
        return this._item.toString();
    }

    public loadItem(modelService: ModelService)
    {
        if (this._item instanceof Item) {
            return;
        }
        this._item = modelService.items.get(this._item);
    }

    public get amount(): number
    {
        return this._amount;
    }

    public get type(): string
    {
        return this._type;
    }

    public get recipe(): Recipe
    {
        if (this._recipe instanceof Recipe) {
            return this._recipe;
        }

        return undefined;
    }

    public get recipeReference(): string
    {
        return this._recipe.toString();
    }

    public loadRecipe(modelService: ModelService)
    {
        if (this._recipe instanceof Recipe) {
            return;
        }
        this._recipe = modelService.recipes.get(this._recipe);
    }
    //#endregion
}
