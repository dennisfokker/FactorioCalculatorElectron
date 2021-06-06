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
    listCalculatedHeight: string = undefined;

    constructor() { }

    ngOnInit()
    {
    }

    ngAfterViewInit()
    {
        // That moment you have to wait for two frames. FeelsGoodMan.
        // setTimeout(() =>
        // {
        //     setTimeout(() =>
        //     {
        //         this.itemGroupContainer.nativeElement.style.height = this.itemGroupContainer.nativeElement.scrollHeight + 5 + 'px';
        //     }, 0);
        // }, 0);
        this.itemGroupContainer.nativeElement.style.height = this.getItemGroupContainerHeight();
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

        if (this.listCalculatedHeight == undefined && !this.collapsed) {
            this.listCalculatedHeight = this.itemGroupContainer.nativeElement.scrollHeight + 5 + 'px';
        }
        
        this.itemGroupContainer.nativeElement.style.height = this.getItemGroupContainerHeight();
    }
}
