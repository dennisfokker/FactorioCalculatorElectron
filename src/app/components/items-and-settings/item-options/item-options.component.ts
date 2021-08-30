import { ItemOptionsService } from './../../../services/item-options.service';
import { ItemOption } from './../../../models/options/itemOption';
import { Component, OnInit, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

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
    sharedInput: FormControl;
    amountInput: FormControl;

    private previousFailedSearchQuery: string = '';

    constructor(private itemOptionsService: ItemOptionsService)
    { }

    ngOnInit()
    {
        const numberValidRegex = /^\d*[.,]?\d{1,2}$/;

        this.sharedInput = new FormControl(this.item.shared);
        this.sharedInput.valueChanges.subscribe((shared) => this.onSharedChanged(shared));
        this.amountInput = new FormControl(this.item.amount, [
            Validators.min(0),
            Validators.max(10000),
            Validators.pattern(numberValidRegex),
            Validators.required
        ]);
        this.amountInput.valueChanges.subscribe((amount) => this.onAmountChanged(amount));
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

    public onSharedChanged(shared)
    {
        if (this?.sharedInput?.valid)
        {
            this.item.shared = shared;
            this.itemOptionsService.publishItemOptionUpdate(this.item);
            return;
        }
    }

    public onAmountChanged(amount)
    {
        if (this?.amountInput?.valid)
        {
            this.item.amount = amount;
            this.itemOptionsService.publishItemOptionUpdate(this.item);
            return;
        }
    }
}
