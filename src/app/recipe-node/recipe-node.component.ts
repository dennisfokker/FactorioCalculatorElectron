import { Ingredient } from './../_models/factorio/ingredient';
import { ModelService } from './../_services/model.service';
import { ModalService } from '../_services/modal.service';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Host, Optional } from '@angular/core';
import { NAComponent } from '../_modals/na/na.component';

@Component({
    selector: 'app-recipe-node',
    templateUrl: './recipe-node.component.html',
    styleUrls: ['./recipe-node.component.css']
})
export class RecipeNodeComponent implements OnInit, AfterViewInit
{
    @ViewChild('ingredientListContainer') ingredientListContainer: ElementRef;
    @Input() ingredient: Ingredient;
    @Input() parentNode: RecipeNodeComponent;

    collapsed: boolean = false;

    protected listCalculatedHeight: string = undefined;

    constructor(private modalService: ModalService,
                private modelService: ModelService)
    { }

    ngOnInit()
    {
        this.ingredient.loadRecipe(this.modelService);
        this.ingredient.loadItem(this.modelService);
    }

    ngAfterViewInit(): void
    {
        if (this.ingredientListContainer)
        {
            this.listCalculatedHeight = this.ingredientListContainer.nativeElement.scrollHeight + 5 + 'px';
            this.ingredientListContainer.nativeElement.style.height = this.getIngredientListContainerHeight();
            this.ingredientListContainer.nativeElement.style.visibility = this.collapsed ? 'hidden' : 'visible';
        }
    }

    getIngredientListContainerHeight(): string
    {
        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    adjustCalculatedListHeight(offset: number): void
    {
        if (this.listCalculatedHeight !== undefined)
        {
            let current: number = Number(this.listCalculatedHeight.substring(0, this.listCalculatedHeight.length - 2));
            current += offset;
            this.listCalculatedHeight = current + 'px';
        }

        this.ingredientListContainer.nativeElement.style.height = this.getIngredientListContainerHeight();

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

        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            this.listCalculatedHeight = this.ingredientListContainer.nativeElement.scrollHeight + 5 + 'px';
        }

        if (this.parentNode !== undefined)
        {
            const offset: number = Number(this.listCalculatedHeight.substring(0, this.listCalculatedHeight.length - 2));
            this.parentNode.adjustCalculatedListHeight(this.collapsed ? -offset : offset);
        }

        this.ingredientListContainer.nativeElement.style.height = this.getIngredientListContainerHeight();

    }

    settingsClick(event)
    {
        event.stopPropagation();
        this.modalService.openModal(NAComponent, {});
    }
}
