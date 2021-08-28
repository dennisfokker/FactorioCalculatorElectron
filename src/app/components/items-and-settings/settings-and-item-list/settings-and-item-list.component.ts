import { FactorioDataLoaderComponent } from './../../../modals/factorio-data-loader/factorio-data-loader.component';
import { ItemSubgroup } from './../../../models/factorio/ItemSubgroup';
import { ItemGroup } from './../../../models/factorio/ItemGroup';
import { Icon } from './../../../models/Helpers/icon';
import { Item } from './../../../models/factorio/item';
import { ModalService } from './../../../services/modal.service';
import { ModelService } from './../../../services/model.service';
import { ItemGroupOption } from './../../../models/options/itemGroupOption';
import { NAComponent } from './../../../modals/na/na.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-settings-and-item-list',
    templateUrl: './settings-and-item-list.component.html',
    styleUrls: ['./settings-and-item-list.component.css']
})
export class SettingsAndItemListComponent implements OnInit
{
    itemGroupOptions: ItemGroupOption[] = [];
    searchQuery: string;

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
