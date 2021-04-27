import { ModelService } from './../_services/model.service';
import { CraftingMachine } from '../_models/factorio/craftingMachine';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Component, OnInit } from '@angular/core';
import { Icon } from '../_models/Helpers/icon';

@Component({
    selector: 'app-default-usage',
    templateUrl: './default-usage.component.html',
    styleUrls: ['./default-usage.component.css']
})
export class DefaultUsageComponent implements OnInit
{
    craftingCategories: RecipeCategory[] = [];
    collapsed = false;

    constructor(public modelService: ModelService)
    {
        modelService.recipeCategoriesChanged.subscribe((craftingCategories) => this.craftingCategories = craftingCategories);
    }

    ngOnInit()
    {
        const machine1 = new CraftingMachine('Assembling machine 1', new Icon('assembling-machine-1.png'));
        const machine2 = new CraftingMachine('Assembling machine 2', new Icon('assembling-machine-2.png'));
        const electricmine = new CraftingMachine('Electric mining drill', new Icon('electric-mining-drill.png'));
        const bobMachine = new CraftingMachine('Assembly machine 4', new Icon('__Unknown__.png'));

        this.modelService.machinesList.push(machine1, machine2, electricmine, bobMachine);
        this.modelService.machines.set(machine1.name, machine1);
        this.modelService.machines.set(machine2.name, machine2);
        this.modelService.machines.set(electricmine.name, electricmine);
        this.modelService.machines.set(bobMachine.name, bobMachine);

        this.craftingCategories.push(new RecipeCategory('Base Factorio', [machine1.name, machine2.name, electricmine.name]));
        this.craftingCategories.push(new RecipeCategory('Bob\'s assembling machines', [bobMachine.name]));
    }
}
