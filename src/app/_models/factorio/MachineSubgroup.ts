import { ModelService } from '../../_services/model.service';
import { Indexable } from '../../_interfaces/indexable';
import { CraftingMachine } from './craftingMachine';


export class MachineSubgroup implements Indexable
{
    constructor(private _name: string,
                private _machines: string[] | CraftingMachine[] = [])
    { }

    public toString(): string
    {
        return this.name;
    }

    public addMachine(machine: CraftingMachine)
    {
        if (this.isStringArray(this._machines))
        {
            this._machines.push(machine.name);
        }
        else
        {
            this._machines.push(machine);
        }
    }

    //#region Getters and Setters
    public get name(): string
    {
        return this._name;
    }

    public get machines(): CraftingMachine[]
    {
        if (this.isStringArray(this._machines))
        {
            return [];
        }

        return this._machines;
    }

    public get machineReferences(): string[]
    {
        if (!this.isStringArray(this._machines))
        {
            return this._machines = this._machines.map(elem => elem.name);
        }

        return this._machines;
    }

    public loadMachines(modelService: ModelService)
    {
        if (this.isStringArray(this._machines))
        {
            this._machines = this._machines.map(elem => modelService.machines.get(elem));
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
