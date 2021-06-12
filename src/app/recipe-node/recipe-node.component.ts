import { ModelService } from './../_services/model.service';
import { Item } from './../_models/factorio/item';
import { ModalService } from '../_services/modal.service';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Host, Optional } from '@angular/core';
import { Ingredient } from '../_models/factorio/ingredient';
import { NAComponent } from '../_modals/na/na.component';
import { Recipe } from '../_models/factorio/recipe';

@Component({
    selector: 'app-recipe-node',
    templateUrl: './recipe-node.component.html',
    styleUrls: ['./recipe-node.component.css']
})
export class RecipeNodeComponent implements OnInit, AfterViewInit
{
    @ViewChild('ingedientListContainer') ingedientListContainer: ElementRef;
    @Input() ingredient: Ingredient;
    @Input() parentNode: RecipeNodeComponent;

    protected collapsed: boolean = false;
    protected listCalculatedHeight: string = null;

    constructor(private modalService: ModalService,
                private modelService: ModelService)
    { }

    ngOnInit()
    {
        this.ingredient.loadRecipe(this.modelService);
    }

    ngAfterViewInit(): void
    {
        setTimeout(() =>
        {
            if (this.ingedientListContainer)
            {
                this.listCalculatedHeight = this.ingedientListContainer.nativeElement.offsetHeight + 'px';
            }
        }, 0);
    }

    getRecipeListContainerHeight(): string
    {
        if (this.listCalculatedHeight == null)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    adjustCalculatedListHeight(offset: number): void
    {
        if (this.listCalculatedHeight != null)
        {
            let current: number = +this.listCalculatedHeight.substring(0, this.listCalculatedHeight.length - 2);
            current += offset;
            this.listCalculatedHeight = current + 'px';
        }

        if (this.parentNode !== undefined)
        {
            this.parentNode.adjustCalculatedListHeight(offset);
        }
    }

    recipeListContainerCollapseClick()
    {
        if (this.ingredient.recipe.ingredients.length <= 0)
        {
            return;
        }

        this.collapsed = !this.collapsed;

        if (this.listCalculatedHeight == null)
        {
            this.listCalculatedHeight = this.ingedientListContainer.nativeElement.offsetHeight + 'px';
        }

        if (this.parentNode !== undefined)
        {
            const offset: number = +this.listCalculatedHeight.substring(0, this.listCalculatedHeight.length - 2);
            this.parentNode.adjustCalculatedListHeight(this.collapsed ? -offset : offset);
        }
    }

    settingsClick(event)
    {
        event.stopPropagation();
        this.modalService.openModal(NAComponent, {});
    }
}
