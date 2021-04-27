import { ModelService } from '../_services/model.service';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-crafting-category-options',
    templateUrl: './crafting-category-options.component.html',
    styleUrls: ['./crafting-category-options.component.css']
})
export class CraftingCategoryOptionsComponent implements OnInit
{
    @ViewChild('categoryListContainer') categoryListContainer: ElementRef;
    @Input() id: number;
    @Input() craftingCategory: RecipeCategory;
    collapsed: boolean = true;
    listCalculatedHeight: string = undefined;

    constructor(public modelService: ModelService) { }

    ngOnInit(): void
    {
    }

    getCategoryListContainerHeight(): string
    {
        if (this.listCalculatedHeight == null && !this.collapsed)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    categoryListContainerCollapseClick()
    {
        this.collapsed = !this.collapsed;

        if (this.listCalculatedHeight == undefined)
        {
            this.listCalculatedHeight = this.categoryListContainer.nativeElement.offsetHeight + 'px';
        }
    }
}
