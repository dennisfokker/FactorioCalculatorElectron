import { Ingredient } from './ingredient';
import { Result } from './result';
import { MiningDrillMachine } from './miningDrillMachine';
import { Item } from './item';
import { Indexable } from 'app/_interfaces/indexable';
import { ModelService } from '../../_services/model.service';
import { Icon } from '../Helpers/icon';

export class Resource implements Indexable
{
    constructor(private _name: string = 'Unknown',
                private _icon: Icon | Icon[],
                private _minable: boolean = true,
                private _resourceCategory: string,
                private _miningTime: number = 1,
                private _fluidIngredient?: Ingredient,
                private _results: Result[] = [],
                private _miningDrills: string[] | MiningDrillMachine[] = [])
    { }

    public toString(): string
    {
        return this.name;
    }

    public addMiningDrill(miningDrill: MiningDrillMachine)
    {
        if (this.isStringArray(this._miningDrills))
        {
            this._miningDrills.push(miningDrill.name);
        }
        else
        {
            this._miningDrills.push(miningDrill);
        }
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get icon(): Icon | Icon[]
    {
        return this._icon;
    }

    public get minable(): boolean
    {
        return this._minable;
    }

    public get resourceCategory(): string
    {
        return this._resourceCategory;
    }

    public get miningTime(): number
    {
        return this._miningTime;
    }

    public get fluidIngredient(): Ingredient
    {
        return this._fluidIngredient;
    }

    public get results(): Result[]
    {
        return this._results;
    }

    public get miningDrills(): MiningDrillMachine[]
    {
        if (this.isStringArray(this._miningDrills))
        {
            return [];
        }

        return this._miningDrills;
    }

    public get miningDrillReferences(): string[]
    {
        if (!this.isStringArray(this._miningDrills))
        {
            return this._miningDrills = this._miningDrills.map(elem => elem.name);
        }

        return this._miningDrills;
    }

    public loadMiningDrills(modelService: ModelService)
    {
        if (this.isStringArray(this._miningDrills))
        {
            this._miningDrills = this._miningDrills.map(elem => modelService.miningDrills.get(elem));
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length === 0)
        {
            return false;
        }

        return typeof (array[0]) === 'string';
    }
}
