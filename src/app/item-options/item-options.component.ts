import { Component, OnInit, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
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
        if (!searchQuery)
        {
            this.previousFailedSearchQuery = '';
            this.failedSearchQuery = false;
            return true;
        }

        // Just an extension on an already failed query, so don't bother
        if (this.previousFailedSearchQuery && searchQuery.startsWith(this.previousFailedSearchQuery))
        {
            this.failedSearchQuery = true;
            return false;
        }

        this.failedSearchQuery = this.item.item.name.toLowerCase().indexOf(searchQuery) < 0;

        // Store earliest failed query so we can do a pontential quicker check next run
        if (this.failedSearchQuery)
        {
            this.previousFailedSearchQuery = searchQuery;
        }
        else
        {
            this.previousFailedSearchQuery = '';
        }

        return !this.failedSearchQuery;
    }
}
