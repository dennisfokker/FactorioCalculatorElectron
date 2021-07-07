import { ModelService } from '../_services/model.service';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-crafting-category-options',
    templateUrl: './crafting-category-options.component.html',
    styleUrls: ['./crafting-category-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraftingCategoryOptionsComponent implements OnInit, AfterViewInit
{
    @ViewChild('categoryListContainer') categoryListContainer: ElementRef;
    @Input() id: number;
    @Input() craftingCategory: RecipeCategory;

    collapsed: boolean = true;

    protected listCalculatedHeight: string = undefined;

    constructor(public modelService: ModelService)
    { }

    ngOnInit(): void
    {
        this.craftingCategory.loadCraftingMachines(this.modelService);
    }

    ngAfterViewInit(): void
    {
        this.categoryListContainer.nativeElement.style.height = this.getCategoryListContainerHeight();
        this.categoryListContainer.nativeElement.style.visibility = this.collapsed ? 'hidden' : 'visible';
    }

    getCategoryListContainerHeight(): string
    {
        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    categoryListContainerCollapseClick()
    {
        this.collapsed = !this.collapsed;

        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            this.listCalculatedHeight = this.categoryListContainer.nativeElement.scrollHeight + 5 + 'px';
        }

        this.categoryListContainer.nativeElement.style.height = this.getCategoryListContainerHeight();
    }
}
