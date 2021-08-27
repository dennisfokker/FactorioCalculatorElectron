import { MachineOptionsComponent } from './../machine-options/machine-options.component';
import { ModelService } from '../_services/model.service';
import { RecipeCategory } from '../_models/factorio/recipeCategory';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy, OnChanges, HostBinding, ViewChildren, QueryList, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-crafting-category-options',
    templateUrl: './crafting-category-options.component.html',
    styleUrls: ['./crafting-category-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraftingCategoryOptionsComponent implements OnInit, AfterViewInit, OnChanges
{
    @HostBinding('hidden') allMachinesHidden: boolean = false;
    @ViewChild('categoryListContainer') categoryListContainer: ElementRef;
    @ViewChildren('machineOptions') machineOptionComponents: QueryList<MachineOptionsComponent>;
    @ViewChildren('machineOptions', {read: ElementRef}) machineOptionElements: QueryList<ElementRef>;
    @Input() id: number;
    @Input() craftingCategory: RecipeCategory;
    @Input() searchQuery: string;

    collapsed: boolean = true;

    protected listCalculatedHeight: string = undefined;

    private configured: boolean = false;

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

        this.applySearchQuery();

        this.configured = true;
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if (!this.configured)
        {
            // Only run once view was initialised
            return;
        }

        this.applySearchQuery();
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

    private applySearchQuery(): void
    {
        let lowerCaseSearchQuery: string = '';
        if (this.searchQuery)
        {
            lowerCaseSearchQuery = this.searchQuery.toLowerCase();
        }

        // Assume they're all hidden. If they're not we'll set it back to false accordingly
        this.allMachinesHidden = true;

        for (const machineOption of this.machineOptionComponents)
        {
            if (machineOption.applySearchQuery(lowerCaseSearchQuery))
            {
                this.allMachinesHidden = false;
            }
        };

        // Update calculated height
        if (this.collapsed)
        {
            this.listCalculatedHeight = undefined;
        }
        else
        {
            this.listCalculatedHeight = this.categoryListContainer.nativeElement.scrollHeight + 5 + 'px';
        }
    }
}
