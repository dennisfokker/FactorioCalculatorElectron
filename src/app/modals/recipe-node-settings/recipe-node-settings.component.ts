import { IconRendererComponent } from './../../components/utility/icon-renderer/icon-renderer.component';
import { Recipe } from './../../models/factorio/recipe';
import { ModelService } from './../../services/model.service';
import { Result } from './../../models/factorio/result';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../interfaces/modalComponent';
import { ModalResult } from '../../models/Helpers/modalResult';
import { Component, OnInit, Input, ViewContainerRef, ElementRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

interface RecipeSelectOptionData extends Select2OptionData
{
    additional:
    {
        recipe: Recipe,
    };
}

@Component({
    selector: 'app-recipe-node-settings',
    templateUrl: './recipe-node-settings.component.html',
    styleUrls: ['./recipe-node-settings.component.css']
})
export class RecipeNodeSettingsComponent implements OnInit, ModalComponent
{
    @Input() data: any;
    public modalClosed$: Observable<ModalResult>;
    public creationRecipes: Recipe[];
    public selectRecipeData: RecipeSelectOptionData[];
    public options: Options;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    constructor(private modalService: ModalService,
                private modelService: ModelService,
                private view: ViewContainerRef,
                private resolver: ComponentFactoryResolver)
    {
        this.modalClosed$ = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        // Always assume item is already loaded
        (this.data as Result).item.loadCreationRecipes(this.modelService);
        this.creationRecipes = (this.data as Result).item.creationRecipes;
        this.selectRecipeData = [];
        this.creationRecipes.forEach((value: Recipe, index: number) =>
        {
            this.selectRecipeData.push(
                {
                    id: index + '',
                    text: value.name,
                    additional: { recipe: value }
                });
        });

        // Fill in options
        this.options =
        {
            templateResult: this.templateResult.bind(this),
            templateSelection: this.templateSelection.bind(this)
        };
    }

    onOKClick()
    {
        this.modalClosedSource.next(new ModalResult(false));
        this.modalService.close();
    }

    onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }

    public templateResult(state: RecipeSelectOptionData): JQuery | string
    {
        if (!state.id)
        {
            return state.text;
        }

        //let image = '<span class="image"></span>';

        const html: JQuery = jQuery('<span>' + state.text + '</span>');
        if (state.additional.recipe)
        {
            const factory = this.resolver.resolveComponentFactory(IconRendererComponent);
            const createdElement = this.view.createComponent(factory);
            createdElement.instance.componentSize = 32;
            createdElement.instance.icon = this.creationRecipes[state.id].icon;
            setTimeout((htmlIn: JQuery, index: number, element: ComponentRef<IconRendererComponent>) =>
            {
                htmlIn.prepend(((element.hostView as EmbeddedViewRef<any>).rootNodes[index] as HTMLElement).innerHTML);
                this.view.remove(index);
            }, 0, html, this.view.length - 1, createdElement);
            // image = '<app-icon-renderer class="icon" [icon]="creationRecipes[' + state.id + '].icon" [componentSize]="32"></app-icon-renderer>';
        }

        return html;
    }

    public templateSelection(state: RecipeSelectOptionData): JQuery | string
    {
        if (!state.id)
        {
            return state.text;
        }

        return jQuery('<span>' + state.text + '</span>');
    }
}
