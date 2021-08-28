import { MachineOption } from './../../../models/options/machineOption';
import { CraftingMachine } from './../../../models/factorio/craftingMachine';
import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core';

@Component({
    selector: 'app-machine-options',
    templateUrl: './machine-options.component.html',
    styleUrls: ['./machine-options.component.css']
})
export class MachineOptionsComponent implements OnInit
{
    @HostBinding('hidden') failedSearchQuery: boolean = false;
    @Input() id: string;
    @Input() machine: CraftingMachine;
    machineOption: MachineOption;

    private previousFailedSearchQuery: string = '';

    constructor(private elemRef: ElementRef)
    { }

    ngOnInit()
    {
        this.machineOption = new MachineOption(this.machine);
    }

    public applySearchQuery(searchQuery: string): boolean
    {
        // Early exit, if empty, we good
        if (!searchQuery)
        {
            this.previousFailedSearchQuery = '';
            this.failedSearchQuery = false;
            this.elemRef.nativeElement.parentElement.style.display = '';
            return true;
        }

        // Just an extension on an already failed query, so don't bother
        if (this.previousFailedSearchQuery && searchQuery.startsWith(this.previousFailedSearchQuery))
        {
            this.failedSearchQuery = true;
            this.elemRef.nativeElement.parentElement.style.display = 'none';
            return false;
        }

        this.failedSearchQuery = this.machine.name.toLowerCase().indexOf(searchQuery) < 0;
        this.elemRef.nativeElement.parentElement.style.display = this.failedSearchQuery ? 'none' : '';

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
