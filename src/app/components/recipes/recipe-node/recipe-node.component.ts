import { RecipeNodeSettingsComponent } from './../../../modals/recipe-node-settings/recipe-node-settings.component';
import { Recipe } from './../../../models/factorio/recipe';
import { ModelService } from './../../../services/model.service';
import { ModalService } from './../../../services/modal.service';
import { Result } from './../../../models/factorio/result';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-recipe-node',
    templateUrl: './recipe-node.component.html',
    styleUrls: ['./recipe-node.component.css']
})
export class RecipeNodeComponent implements OnInit, AfterViewInit
{
    @ViewChild('ingredientListContainer') ingredientListContainer: ElementRef;
    @Input() result: Result;
    @Output() resultChange: EventEmitter<Result> = new EventEmitter<Result>();
    @Input() parentNode: RecipeNodeComponent;

    collapsed: boolean = false;
    ingredientResults: Result[] = [];

    protected listCalculatedHeight: string;

    constructor(private modalService: ModalService,
                private modelService: ModelService)
    { }

    ngOnInit()
    {
        this.result.loadRecipe(this.modelService);
        this.result.loadItem(this.modelService);
        this.updateIngredientResults();

        this.resultChange.subscribe((result) =>
        {
            this.result.loadRecipe(this.modelService);
            this.result.loadItem(this.modelService);
            this.updateIngredientResults();

            this.listCalculatedHeight = undefined;
            if (this.ingredientListContainer)
            {
                this.ingredientListContainer.nativeElement.style.height = this.getIngredientListContainerHeight();
            }
        });
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

    public trackRecipeNode(index: number, item: Result)
    {
        return item.itemReference;
    }

    public recipeListContainerCollapseClick()
    {
        if (this.ingredientResults.length <= 0)
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

    public settingsClick(event)
    {
        event.stopPropagation();
        this.modalService.openModal(RecipeNodeSettingsComponent, { result: this.result }).subscribe((result) =>
        {
            if (!result.canceled)
            {
                this.result = new Result(this.result.item, this.result.type, this.result.amount, this.result.probability, result.result);
                this.resultChange.emit(this.result);
            }
        });
    }

    private updateIngredientResults(): void
    {
        if (!this.result.recipe)
        {
            // If no recipe specified yet, nothing to do here
            return;
        }

        let sourceResult: Result;
        this.ingredientResults = [];

        for (const curRes of this.result.recipe.results)
        {
            if (curRes.itemReference === this.result.item.name)
            {
                sourceResult = curRes;
                break;
            }
        }
        if (!sourceResult)
        {
            console.error('Somehow found result who\'s item (%s) is not a result of the result\'s recipe (%s).', this.result.item.name, this.result.recipe.name);
            return;
        }

        for (const ingredient of this.result.recipe.ingredients)
        {
            ingredient.loadItem(this.modelService);

            // Store a copy of the result (prevent changing source) with some final contextual tweaks
            this.ingredientResults.push(new Result(ingredient.item,
                                                   ingredient.type,
                                                   ingredient.amount / sourceResult.amount * this.result.amount));
        }
    }

    private getIngredientListContainerHeight(): string
    {
        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    private adjustCalculatedListHeight(offset: number): void
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
}
