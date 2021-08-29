import { ItemOption } from './../models/options/itemOption';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

interface ChangedItemOption
{
    newItemOption: ItemOption;
    oldItemOption: ItemOption;
};

@Injectable()
export class ItemOptionsService
{
    nonSharedItemAdded$: Observable<ChangedItemOption>;
    nonSharedItemRemoved$: Observable<ChangedItemOption>;
    nonSharedItemUpdated$: Observable<ChangedItemOption>;
    sharedItemAdded$: Observable<ChangedItemOption>;
    sharedItemRemoved$: Observable<ChangedItemOption>;
    sharedItemUpdated$: Observable<ChangedItemOption>;

    protected previousItemOptions: Map<string, ItemOption> = new Map<string, ItemOption>();

    private nonSharedItemAddedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private nonSharedItemRemovedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private nonSharedItemUpdatedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private sharedItemAddedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private sharedItemRemovedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private sharedItemUpdatedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();

    constructor()
    {
        this.nonSharedItemAdded$ = this.nonSharedItemAddedSource.asObservable();
        this.nonSharedItemRemoved$ = this.nonSharedItemRemovedSource.asObservable();
        this.nonSharedItemUpdated$ = this.nonSharedItemUpdatedSource.asObservable();
        this.sharedItemAdded$ = this.sharedItemAddedSource.asObservable();
        this.sharedItemRemoved$ = this.sharedItemRemovedSource.asObservable();
        this.sharedItemUpdated$ = this.sharedItemUpdatedSource.asObservable();
    }

    public publishItemOptionUpdate(item: ItemOption): void
    {
        const itemParam = { ...item };
        const previousItemOption = this.previousItemOptions.get(itemParam.item.name);
        const payload = { newItemOption: itemParam, oldItemOption: previousItemOption };

        if (!previousItemOption)
        {
            this.publishNewItemOption(itemParam, payload);
            return;
        }

        if (itemParam.amount <= 0)
        {
            this.publishEmptyItemOption(itemParam, previousItemOption, payload);
            return;
        }

        if (itemParam.shared !== previousItemOption.shared)
        {
            this.publishSwitchedSharedItemOption(itemParam, previousItemOption, payload);
            return;
        }

        // Just regular value update
        if (itemParam.shared)
        {
            this.sharedItemUpdatedSource.next(payload);
        }
        else
        {
            this.nonSharedItemUpdatedSource.next(payload);
        }
        this.previousItemOptions.set(itemParam.item.name, itemParam);
    }

    private publishNewItemOption(item: ItemOption, payload: ChangedItemOption): void
    {
        if (item.shared)
        {
            // Shared item added
            this.sharedItemAddedSource.next(payload);
            this.previousItemOptions.set(item.item.name, item);
        }
        else if (item.amount > 0)
        {
            // Recipe column item added if it's actually got an amount
            this.nonSharedItemAddedSource.next(payload);
            this.previousItemOptions.set(item.item.name, item);
        }
    }

    private publishEmptyItemOption(item: ItemOption, previousItemOption: ItemOption, payload: ChangedItemOption): void
    {
        if (item.shared)
        {
            if (previousItemOption.shared)
            {
                // Just decreased additional shared amount
                this.sharedItemUpdatedSource.next(payload);
            }
            else
            {
                // Became shared, but was nothing previously
                this.sharedItemAddedSource.next(payload);
                this.nonSharedItemRemovedSource.next(payload);
            }

            // If it's shared, it's always "present"
            this.previousItemOptions.set(item.item.name, item);
        }
        else
        {
            if (previousItemOption.shared)
            {
                // No longer shared
                this.sharedItemRemovedSource.next(payload);
                this.previousItemOptions.delete(item.item.name);
            }
            else
            {
                // Was a recipe column but now removed
                this.nonSharedItemRemovedSource.next(payload);
                this.previousItemOptions.delete(item.item.name);
            }
        }
    }

    private publishSwitchedSharedItemOption(item: ItemOption, previousItemOption: ItemOption, payload: ChangedItemOption): void
    {
        if (item.shared)
        {
            // Was not shared and is shared now
            this.nonSharedItemRemovedSource.next(payload);
            this.sharedItemAddedSource.next(payload);
        }
        else
        {
            // Was shared and is not shared now
            this.sharedItemRemovedSource.next(payload);
            this.nonSharedItemAddedSource.next(payload);
        }

        // Always update previous value
        this.previousItemOptions.set(item.item.name, item);
    }
}
