import { MachineGroupOptionsComponent } from './components/machines/machine-group-options/machine-group-options.component';
import { MachineListComponent } from './components/machines/machine-list/machine-list.component';
import { ModelService } from './services/model.service';
import { ModalService } from './services/modal.service';
import { IconRendererComponent } from './components/utility/icon-renderer/icon-renderer.component';
import { ModalDirective } from './directives/modal.directive';
import { NAComponent } from './modals/na/na.component';
import { ModalContainerComponent } from './modals/modal-container/modal-container.component';
import { ModPathSelectorComponent } from './modals/mod-path-selector/mod-path-selector.component';
import { FactorioDataLoaderComponent } from './modals/factorio-data-loader/factorio-data-loader.component';
import { FactorioPathSelectorComponent } from './modals/factorio-path-selector/factorio-path-selector.component';
import { RecipeNodeComponent } from './components/recipes/recipe-node/recipe-node.component';
import { RecipeColumnComponent } from './components/recipes/recipe-column/recipe-column.component';
import { ItemOptionsComponent } from './components/items-and-settings/item-options/item-options.component';
import { ItemGroupOptionsComponent } from './components/items-and-settings/item-group-options/item-group-options.component';
import { MachineOptionsComponent } from './components/machines/machine-options/machine-options.component';
import { SettingsAndItemListComponent } from './components/items-and-settings/settings-and-item-list/settings-and-item-list.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxElectronModule } from 'ngx-electron';
import { SafePipeModule } from 'safe-pipe';


@NgModule({
    declarations: [
        AppComponent,
        RecipeColumnComponent,
        MachineListComponent,
        SettingsAndItemListComponent,
        MachineOptionsComponent,
        MachineGroupOptionsComponent,
        ItemGroupOptionsComponent,
        ItemOptionsComponent,
        RecipeNodeComponent,
        FactorioPathSelectorComponent,
        FactorioDataLoaderComponent,
        ModPathSelectorComponent,
        NAComponent,
        ModalContainerComponent,
        ModalDirective,
        IconRendererComponent
    ],
    imports: [
        SafePipeModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxElectronModule
    ],
    entryComponents: [FactorioDataLoaderComponent, FactorioPathSelectorComponent, ModPathSelectorComponent, NAComponent],
    providers: [ModelService, ModalService],
    bootstrap: [AppComponent]
})
export class AppModule
{ }
