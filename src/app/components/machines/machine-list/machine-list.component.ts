import { Icon } from './../../../models/Helpers/icon';
import { CraftingMachine } from './../../../models/factorio/craftingMachine';
import { ModelService } from './../../../services/model.service';
import { MachineSubgroup } from './../../../models/factorio/MachineSubgroup';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-machine-list',
    templateUrl: './machine-list.component.html',
    styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit
{
    machineSubgroups: MachineSubgroup[] = [];
    collapsed = false;
    searchQuery: string;

    constructor(public modelService: ModelService)
    {
        modelService.machineSubgroupsChanged$.subscribe((machineSubgroups) => this.machineSubgroups = machineSubgroups);
    }

    ngOnInit()
    {
        const machine1 = new CraftingMachine('Assembling machine 1', new Icon('__internal__/assembling-machine-1.png'));
        const machine2 = new CraftingMachine('Assembling machine 2', new Icon('__internal__/assembling-machine-2.png'));
        const electricmine = new CraftingMachine('Electric mining drill', new Icon('__internal__/electric-mining-drill.png'));
        const bobMachine = new CraftingMachine('Assembly machine 4', new Icon('__internal__/__Unknown__.png'));

        this.modelService.machines.set(machine1.name, machine1);
        this.modelService.machines.set(machine2.name, machine2);
        this.modelService.machines.set(electricmine.name, electricmine);
        this.modelService.machines.set(bobMachine.name, bobMachine);

        this.machineSubgroups.push(new MachineSubgroup('Base Factorio', [machine1.name, machine2.name, electricmine.name]));
        this.machineSubgroups.push(new MachineSubgroup('Bob\'s assembling machines', [bobMachine.name]));
    }
}
