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
    nonSharedItemAdded$: Observable<ItemOption>;
    nonSharedItemRemoved$: Observable<ItemOption>;
    nonSharedItemUpdated$: Observable<ChangedItemOption>;
    sharedItemAdded$: Observable<ItemOption>;
    sharedItemRemoved$: Observable<ItemOption>;
    sharedItemUpdated$: Observable<ChangedItemOption>;

    protected previousItemOptions: Map<string, ItemOption> = new Map<string, ItemOption>();

    private nonSharedItemAddedSource: Subject<ItemOption> = new Subject<ItemOption>();
    private nonSharedItemRemovedSource: Subject<ItemOption> = new Subject<ItemOption>();
    private nonSharedItemUpdatedSource: Subject<ChangedItemOption> = new Subject<ChangedItemOption>();
    private sharedItemAddedSource: Subject<ItemOption> = new Subject<ItemOption>();
    private sharedItemRemovedSource: Subject<ItemOption> = new Subject<ItemOption>();
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
            this.publishNewItemOption(itemParam);
            return;
        }

        if (itemParam.amount <= 0)
        {
            this.publishEmptyItemOption(itemParam, previousItemOption);
            return;
        }

        if (itemParam.shared !== previousItemOption.shared)
        {
            this.publishSwitchedSharedItemOption(itemParam);
            return;
        }

        // Just regular value update
        if (itemParam.shared)
        {
            this.sharedItemUpdatedSource.next({ newItemOption: itemParam, oldItemOption: previousItemOption });
        }
        else
        {
            this.nonSharedItemUpdatedSource.next({ newItemOption: itemParam, oldItemOption: previousItemOption });
        }
        this.previousItemOptions.set(itemParam.item.name, itemParam);
    }

    private publishNewItemOption(item: ItemOption): void
    {
        if (item.shared)
        {
            // Shared item added
            this.sharedItemAddedSource.next(item);
            this.previousItemOptions.set(item.item.name, item);
        }
        else if (item.amount > 0)
        {
            // Recipe column item added if it's actually got an amount
            this.nonSharedItemAddedSource.next(item);
            this.previousItemOptions.set(item.item.name, item);
        }
    }

    private publishEmptyItemOption(item: ItemOption, previousItemOption: ItemOption): void
    {
        if (item.shared)
        {
            if (previousItemOption.shared)
            {
                // Just decreased additional shared amount
                this.sharedItemUpdatedSource.next({ newItemOption: item, oldItemOption: previousItemOption });
            }
            else
            {
                // Became shared, but was nothing previously
                this.sharedItemAddedSource.next(item);
                this.nonSharedItemRemovedSource.next(item);
            }

            // If it's shared, it's always "present"
            this.previousItemOptions.set(item.item.name, item);
        }
        else
        {
            if (previousItemOption.shared)
            {
                // No longer shared
                this.sharedItemRemovedSource.next(item);
                this.previousItemOptions.delete(item.item.name);
            }
            else
            {
                // Was a recipe column but now removed
                this.nonSharedItemRemovedSource.next(item);
                this.previousItemOptions.delete(item.item.name);
            }
        }
    }

    private publishSwitchedSharedItemOption(item: ItemOption): void
    {
        if (item.shared)
        {
            // Was not shared and is shared now
            this.nonSharedItemRemovedSource.next(item);
            this.sharedItemAddedSource.next(item);
        }
        else
        {
            // Was shared and is not shared now
            this.sharedItemRemovedSource.next(item);
            this.nonSharedItemAddedSource.next(item);
        }

        // Always update previous value
        this.previousItemOptions.set(item.item.name, item);
    }
}
