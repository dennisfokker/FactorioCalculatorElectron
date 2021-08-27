import { Resource } from './resource';
import { Icon } from '../Helpers/icon';
import { EffectType } from '../../_types/effectType';
import { Machine } from '../../_interfaces/machine';
import { ModelService } from 'app/_services/model.service';
import { MachineSubgroup } from './MachineSubgroup';

export class MiningDrillMachine implements Machine
{
    constructor(private _name: string,
                private _icon: Icon | Icon[],
                private _subgroup: string | MachineSubgroup = 'crafting',
                private _speed: number = 1,
                private _production: number = 0,
                private _allowedEffects: EffectType[] = ['speed', 'productivity', 'consumption', 'pollution'],
                private _resourceCategories: string[] = [],
                private _minableResources: string[] | Resource[] = [])
    { }

    public toString(): string
    {
        return this.name;
    }

    public addMinableResource(resource: Resource)
    {
        if (this.isStringArray(this._minableResources))
        {
            this._minableResources.push(resource.name);
        }
        else
        {
            this._minableResources.push(resource);
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

    public get subgroup(): MachineSubgroup
    {
        if (this._subgroup instanceof MachineSubgroup)
        {
            return this._subgroup;
        }

        return undefined;
    }

    public get subgroupReference(): string
    {
        return this._subgroup.toString();
    }

    public loadSubgroup(modelService: ModelService)
    {
        if (this._subgroup instanceof MachineSubgroup)
        {
            return;
        }
        this._subgroup = modelService.machineSubgroups.get(this._subgroup);
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

    public get mineableResources(): Resource[]
    {
        if (this.isStringArray(this._minableResources))
        {
            return [];
        }

        return this._minableResources;
    }

    public get mineableResourceReferences(): string[]
    {
        if (!this.isStringArray(this._minableResources))
        {
            return this._minableResources = this._minableResources.map(elem => elem.name);
        }

        return this._minableResources;
    }

    public loadMineableResources(modelService: ModelService)
    {
        if (this.isStringArray(this._minableResources))
        {
            this._minableResources = this._minableResources.map(elem => modelService.resources.get(elem));
        }
    }
    //#endregion

    private isStringArray<T>(array: string[] | T[]): array is string[]
    {
        if (array.length === 0)
        {
            return false;
        }

        return typeof(array[0]) === 'string';
    }
}
