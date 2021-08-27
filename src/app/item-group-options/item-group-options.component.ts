import { ItemOptionsComponent } from './../item-options/item-options.component';
import { ItemGroupOption } from './../_models/options/itemGroupOption';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, HostBinding, ViewChildren, QueryList } from '@angular/core';

@Component({
    selector: 'app-item-group-options',
    templateUrl: './item-group-options.component.html',
    styleUrls: ['./item-group-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemGroupOptionsComponent implements OnInit, AfterViewInit, OnChanges
{
    @HostBinding('hidden') allItemsHidden: boolean = false;
    @ViewChild('itemGroupContainer') itemGroupContainer: ElementRef;
    @ViewChildren('itemOptions') itemOptionComponents: QueryList<ItemOptionsComponent>;
    @Input() id: number;
    @Input() itemGroupOption: ItemGroupOption;
    @Input() searchQuery: string;

    collapsed: boolean = true;

    protected listCalculatedHeight: string = undefined;

    private configured: boolean = false;

    constructor()
    { }

    ngOnInit()
    {
    }

    ngAfterViewInit()
    {
        this.itemGroupContainer.nativeElement.style.height = this.getItemGroupContainerHeight();
        this.itemGroupContainer.nativeElement.style.visibility = this.collapsed ? 'hidden' : 'visible';

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

    getItemGroupContainerHeight(): string
    {
        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    itemGroupContainerCollapseClick()
    {
        this.collapsed = !this.collapsed;

        if (this.listCalculatedHeight === undefined && !this.collapsed)
        {
            this.listCalculatedHeight = this.itemGroupContainer.nativeElement.scrollHeight + 5 + 'px';
        }

        this.itemGroupContainer.nativeElement.style.height = this.getItemGroupContainerHeight();
    }

    private applySearchQuery(): void
    {
        let lowerCaseSearchQuery: string = '';
        if (this.searchQuery)
        {
            lowerCaseSearchQuery = this.searchQuery.toLowerCase();
        }

        // Assume they're all hidden. If they're not we'll set it back to false accordingly
        this.allItemsHidden = true;

        for (const itemOption of this.itemOptionComponents)
        {
            if (itemOption.applySearchQuery(lowerCaseSearchQuery))
            {
                this.allItemsHidden = false;
            }
        }
    }
}
