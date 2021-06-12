import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RecipesComponent } from './recipes/recipes.component';
import { DefaultMachineUsageComponent } from './default-machine-usage/default-machine-usage.component';
import { SettingsAndItemsComponent } from './settings-and-items/settings-and-items.component';
import { MachineOptionsComponent } from './machine-options/machine-options.component';
import { CraftingCategoryOptionsComponent } from './crafting-category-options/crafting-category-options.component';
import { ItemGroupOptionsComponent } from './item-group-options/item-group-options.component';
import { ItemOptionsComponent } from './item-options/item-options.component';
import { RecipeNodeComponent } from './recipe-node/recipe-node.component';
import { ModelService } from './_services/model.service';
import { FactorioDataSelectorComponent } from './_modals/factorio-data-selector/factorio-data-selector.component';
import { FactorioPathSelectorComponent } from './_modals/factorio-path-selector/factorio-path-selector.component';
import { ModalService } from './_services/modal.service';
import { ModalContainerComponent } from './_modals/modal-container/modal-container.component';
import { ModalDirective } from './_directives/modal.directive';
import { ModPathSelectorComponent } from './_modals/mod-path-selector/mod-path-selector.component';
import { NAComponent } from './_modals/na/na.component';
import { IconRendererComponent } from './icon-renderer/icon-renderer.component';

import { NgxElectronModule } from 'ngx-electron';


@NgModule({
    declarations: [
        AppComponent,
        RecipesComponent,
        DefaultMachineUsageComponent,
        SettingsAndItemsComponent,
        MachineOptionsComponent,
        CraftingCategoryOptionsComponent,
        ItemGroupOptionsComponent,
        ItemOptionsComponent,
        RecipeNodeComponent,
        FactorioPathSelectorComponent,
        FactorioDataSelectorComponent,
        ModPathSelectorComponent,
        NAComponent,
        ModalContainerComponent,
        ModalDirective,
        IconRendererComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxElectronModule
    ],
    entryComponents: [FactorioDataSelectorComponent, FactorioPathSelectorComponent, ModPathSelectorComponent, NAComponent],
    providers: [ModelService, ModalService],
    bootstrap: [AppComponent]
})
export class AppModule
{ }
