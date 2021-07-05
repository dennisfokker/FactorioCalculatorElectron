import { ItemGroupOption } from './../_models/options/itemGroupOption';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-item-group-options',
    templateUrl: './item-group-options.component.html',
    styleUrls: ['./item-group-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemGroupOptionsComponent implements OnInit, AfterViewInit
{
    @ViewChild('itemGroupContainer') itemGroupContainer: ElementRef;
    @Input() id: number;
    @Input() itemGroupOption: ItemGroupOption;

    collapsed: boolean = true;

    protected listCalculatedHeight: string = undefined;

    constructor()
    { }

    ngOnInit()
    {
    }

    ngAfterViewInit()
    {
        this.itemGroupContainer.nativeElement.style.height = this.getItemGroupContainerHeight();
        this.itemGroupContainer.nativeElement.style.visibility = 'hidden';
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
}
