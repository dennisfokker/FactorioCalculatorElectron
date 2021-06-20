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
import { FactorioDataSelectorComponent } from 'app/_modals/factorio-data-selector/factorio-data-selector.component';
import { Icon } from '../_models/Helpers/icon';

@Component({
    selector: 'app-settings-and-items',
    templateUrl: './settings-and-items.component.html',
    styleUrls: ['./settings-and-items.component.css']
})
export class SettingsAndItemsComponent implements OnInit
{
    itemGroupOptions: ItemGroupOption[] = [];

    constructor(public modelService: ModelService,
                public modalService: ModalService)
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
        this.modalService.openModal(FactorioDataSelectorComponent, {}).subscribe((result) =>
        {
            if (result.canceled)
            {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) =>
            {
                if (typeof reader.result === 'string')
                {
                    // First extract the needed data:
                    const filterMatch: RegExpMatchArray = reader.result.match(/\@__JsonCalculatorExporter__\/data-final-fixes\.lua\:\d+\: ({.+})\n\r?\s+\d+\.\d+ \w/s);
                    let rawData: string;
                    if (filterMatch.length > 0)
                    {
                        rawData = filterMatch[1];
                    }
                    else
                    {
                        rawData = reader.result;
                    }

                    // Now it's time for some cleanup. Turn the lua export into valid JSON.
                    // Since the calculator requires a mod that already outputs mostly JSON, we don't need to do most of this cleanup
                    //rawData = rawData.replace(/(?:\[")?(\S+)(?<!"\])(?:"\])? =/g, '"$1":'); // Fix key definitions
                    //rawData = rawData.replace(/nil/g, 'null'); // Fix nil to null
                    //rawData = rawData.replace(/(,\n(\s+))\{\s*\}/g, '$1{\n$2}'); // Fix empty objects (expand them)
                    //rawData = rawData.replace(/-?1\/0 --\[\[-?math\.huge\]\]/g, '-1'); // Fix math operations
                    rawData = rawData.replace(/ -?inf/g, 'null'); // Fix math operations
                    //rawData = rawData.replace(/(\s+\{\n^(\s+))\{((?:(?!\n\2\})\n^.+)+?\n\2\},\n(?=\s+"))/gm, '$1"anonymous": {$3'); // Fix objects inside objects (nested object brackets are called "anonymous")
                    //rawData = rawData.replace(/^((\s+)\{(\n(?!\2\}).+)+?\n\2\}),\n\s+(?!\{|\s|null)[^{\s].*/gm, '$1'); // Fix arrays with loose property at the end
                    //rawData = rawData.replace(/\{(\n\s*(\{|null))/g, '[$1'); // Fix array starts
                    //while (rawData.search(/(^(\s+)\{(?:(?!\n\2(?:[\}\]]\n|null\n))\n.*)+\n\2(?:[\}\]]|null)\n\s+)\}(?=\n|,\n\s+")/gm) !== -1) {
                    //    rawData = rawData.replace(/(^(\s+)\{(?:(?!\n\2(?:[\}\]]\n|null\n))\n.*)+\n\2(?:[\}\]]|null)\n\s+)\}(?=\n|,\n\s+")/gm, '$1]'); // Fix array ends
                    //}
                    //while (rawData.search(/^(\s+)(\S.+)?(?:\{((?:\n(?!\1\}|.+:).+$)+?\n\1)[\}\]]|[\{\[]((?:\n(?!\1\}|.+:).+$)+?\n\1)\})/gm) !== -1) {
                    //    rawData = rawData.replace(/^(\s+)(\S.+)?(?:\{((?:\n(?!\1\}|.+:).+$)+?\n\1)[\}\]]|[\{\[]((?:\n(?!\1\}|.+:).+$)+?\n\1)\})/gm, '$1$2[$3$4]'); // Fix non-object arrays
                    //}
                    //rawData = rawData.replace(/^(\s+)\}(\n\1\{)/gm, '$1},$2'); // Fix missing commas

                    this.modelService.updateDataFromJSON(JSON.parse(rawData));
                }
            };
            reader.readAsText(result.result);
        });
    }

    setFactorioPath()
    {
        this.modalService.openModal(FactorioPathSelectorComponent, {}).subscribe((result) =>
        {
            if (result.canceled)
            {
                return;
            }

            this.modelService.updateFactorioPath(result.result);
        });
    }

    setModPath()
    {
        this.modalService.openModal(ModPathSelectorComponent, {}).subscribe((result) =>
        {
            if (result.canceled)
            {
                return;
            }

            this.modelService.updateModsPath(result.result);
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
