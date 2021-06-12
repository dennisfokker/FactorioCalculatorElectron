import { Icon } from '../Helpers/icon';
import { EffectType } from '../../_types/effectType';
import { Machine } from '../../_interfaces/machine';

export class MiningDrillMachine implements Machine
{
    constructor(private _name: string,
        private _icon: Icon | Icon[],
        private _speed: number = 1,
        private _production: number = 0,
        private _allowedEffects: EffectType[] = ['speed', 'productivity', 'consumption', 'pollution'],
        private _resourceCategories: string[] = []) { }

    public toString(): string
    {
        return this.name;
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

    public get speed(): number
    {
        return this._speed;
    }

    public get production(): number
    {
        return this._production;
    }

    public get allowedEffects(): EffectType[]
    {
        return this._allowedEffects;
    }

    public get resourceCategories(): string[]
    {
        return this._resourceCategories;
    }
    //#endregion
}
