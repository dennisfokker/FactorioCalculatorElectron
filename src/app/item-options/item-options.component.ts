import { Component, OnInit, Input, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef, SkipSelf } from '@angular/core';
import { ItemOption } from 'app/_models/options/itemOption';

@Component({
    selector: 'app-item-options',
    templateUrl: './item-options.component.html',
    styleUrls: ['./item-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemOptionsComponent implements OnInit
{
    @HostBinding('hidden') failedSearchQuery: boolean = false;
    @Input() id: string;
    @Input() item: ItemOption;

    private previousFailedSearchQuery: string = '';

    constructor()
    { }

    ngOnInit()
    {
    }

    public applySearchQuery(searchQuery: string): boolean
    {
        // Early exit, if empty, we good
        if (!searchQuery || searchQuery === '')
        {
            this.previousFailedSearchQuery = '';
            this.failedSearchQuery = false;
            return true;
        }

        //// TODO implement early filter based on previousFailedSearchQuery
        this.failedSearchQuery = this.item.item.name.toLowerCase().indexOf(searchQuery) < 0;

        return !this.failedSearchQuery;
    }
}
