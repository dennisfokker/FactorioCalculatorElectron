import { ItemSubgroup } from './../_models/factorio/ItemSubgroup';
import { ItemGroupOption } from './../_models/options/itemGroupOption';
import { ItemGroup } from './../_models/factorio/ItemGroup';
import { Item } from './../_models/factorio/item';
import { ModelService } from './../_services/model.service';
import { ModPathSelectorComponent } from './../_modals/mod-path-selector/mod-path-selector.component';
import { Component, OnInit } from '@angular/core';
import { ModalService } from './../_services/modal.service';
import { FactorioPathSelectorComponent } from '../_modals/factorio-path-selector/factorio-path-selector.component';
import { NAComponent } from '../_modals/na/na.component';
import { FactorioDataLoaderComponent } from 'app/_modals/factorio-data-loader/factorio-data-loader.component';
import { Icon } from '../_models/Helpers/icon';

@Component({
    selector: 'app-settings-and-items',
    templateUrl: './settings-and-items.component.html',
    styleUrls: ['./settings-and-items.component.css']
})
export class SettingsAndItemsComponent implements OnInit
{
    itemGroupOptions: ItemGroupOption[] = [];

    constructor(private modelService: ModelService,
                private modalService: ModalService)
    {
        modelService.itemGroupsChanged.subscribe((itemGroups) =>
        {
            this.itemGroupOptions = itemGroups.reduce((result: ItemGroupOption[], itemGroup) =>
            {
                const itemGroupOption = itemGroup.toOption(modelService);
                if (itemGroupOption.items.length > 0)
                {
                    result.push(itemGroupOption);
                }
                return result;
            }, []);
        });
    }

    ngOnInit()
    {
        const ironPlateItem = new Item('Iron plate', new Icon('__internal__/iron-plate.png'), 'Intermediates');
        const copperCableItem = new Item('Copper cable', new Icon('__internal__/copper-cable.png'), 'Intermediates');
        const aluminumPlateItem = new Item('Aluminum plate', new Icon('__internal__/__Unknown__.png'), 'Bob\'s intermediates');
        this.modelService.items.set(ironPlateItem.name, ironPlateItem);
        this.modelService.items.set(copperCableItem.name, copperCableItem);
        this.modelService.items.set(aluminumPlateItem.name, aluminumPlateItem);

        this.itemGroupOptions.push(new ItemGroup('Intermediates',
                                                 undefined,
                                                 [
                                                     new ItemSubgroup('temp1', 'Intermediates', [ironPlateItem, copperCableItem])
                                                 ]).toOption(this.modelService));
        this.itemGroupOptions.push(new ItemGroup('Bob\'s intermediates',
                                                 undefined,
                                                 [
                                                     new ItemSubgroup('temp2', 'Bob\'s intermediates', [aluminumPlateItem])
                                                 ]).toOption(this.modelService));
    }

    importFactorioData()
    {
        this.modalService.openModal(FactorioDataLoaderComponent, {}).subscribe((result) =>
        {
            if (result.canceled)
            {
                return;
            }

            this.modelService.updateDataFromJSON(result.result);
        });
    }

    importSettings()
    {
        this.modalService.openModal(NAComponent, {});
    }

    exportSettings()
    {
        this.modalService.openModal(NAComponent, {});
    }
}
