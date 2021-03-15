import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ItemOption } from 'app/_models/options/itemOption';

@Component({
    selector: 'app-item-options',
    templateUrl: './item-options.component.html',
    styleUrls: ['./item-options.component.css']
})
export class ItemOptionsComponent implements OnInit
{
    @Input() id: string;
    @Input() item: ItemOption;

    constructor(private elRef: ElementRef) { }

    ngOnInit()
    {
    }
}
