import { ItemGroupOption } from './../_models/options/itemGroupOption';
import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-item-group-options',
    templateUrl: './item-group-options.component.html',
    styleUrls: ['./item-group-options.component.css']
})
export class ItemGroupOptionsComponent implements OnInit
{
    @ViewChild('itemGroupContainer') itemGroupContainer: ElementRef;
    @Input() id: number;
    @Input() itemGroupOption: ItemGroupOption;
    collapsed: boolean = false;
    listCalculatedHeight: string = undefined;

    constructor() { }

    ngOnInit()
    {
    }

    getItemGroupContainerHeight(): string
    {
        if (this.listCalculatedHeight == undefined && !this.collapsed) {
            return 'auto';
        }

        return this.collapsed ? '0px' : this.listCalculatedHeight;
    }

    itemGroupContainerCollapseClick()
    {
        this.collapsed = !this.collapsed;

        if (this.listCalculatedHeight == undefined) {
            this.listCalculatedHeight = this.itemGroupContainer.nativeElement.scrollHeight + 5 + 'px';
        }
    }
}
