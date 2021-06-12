import { ModelService } from '../_services/model.service';
import { CraftingMachine } from '../_models/factorio/craftingMachine';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Component, OnInit } from '@angular/core';
import { Icon } from '../_models/Helpers/icon';

@Component({
    selector: 'app-default-machine-usage',
    templateUrl: './default-machine-usage.component.html',
    styleUrls: ['./default-machine-usage.component.css']
})
export class DefaultMachineUsageComponent implements OnInit
{
    craftingCategories: RecipeCategory[] = [];
    collapsed = false;

    constructor(public modelService: ModelService)
    {
        modelService.recipeCategoriesChanged.subscribe((craftingCategories) => this.craftingCategories = craftingCategories);
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

        this.craftingCategories.push(new RecipeCategory('Base Factorio', [machine1.name, machine2.name, electricmine.name]));
        this.craftingCategories.push(new RecipeCategory('Bob\'s assembling machines', [bobMachine.name]));
    }
}
