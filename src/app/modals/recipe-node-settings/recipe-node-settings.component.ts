import { IconRendererComponent } from './../../components/utility/icon-renderer/icon-renderer.component';
import { Recipe } from './../../models/factorio/recipe';
import { ModelService } from './../../services/model.service';
import { Result } from './../../models/factorio/result';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../interfaces/modalComponent';
import { ModalResult } from '../../models/Helpers/modalResult';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-recipe-node-settings',
    templateUrl: './recipe-node-settings.component.html',
    styleUrls: ['./recipe-node-settings.component.css']
})
export class RecipeNodeSettingsComponent implements OnInit, ModalComponent
{
    @Input() data: any;
    public modalClosed$: Observable<ModalResult>;
    public creationRecipes: Recipe[];
    public selectedRecipe: Recipe;
    public selectedIndex: number = -1;
    public listHidden: boolean = true;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    constructor(private modalService: ModalService,
                private modelService: ModelService)
    {
        this.modalClosed$ = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        // Always assume item is already loaded
        (this.data.result as Result).item.loadCreationRecipes(this.modelService);
        this.creationRecipes = (this.data.result as Result).item.creationRecipes;
        this.selectedIndex = this.data.selectedIndex | -1;
    }

    public onOKClick()
    {
        this.modalClosedSource.next(new ModalResult(false, this.selectedRecipe));
        this.modalService.close();
    }

    public onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }

    public selectItem(index)
    {
        // Store selection and hide list
        this.selectedRecipe = this.creationRecipes[index];
        this.listHidden = true;
        this.selectedIndex = index;
    }

    public onKeyPress(event)
    {
        if (!this.listHidden)
        {
            if (event.key === 'Escape')
            {
                // Just exit, not changes
                this.listHidden = true;
            }
            else if (event.key === 'Enter')
            {
                // Select whatever we manually set the selected index to
                this.selectItem(this.selectedIndex);
            }
            else if (event.key === 'ArrowDown')
            {
                // Scroll to the previous element in the list
                this.listHidden = false;
                this.selectedIndex = (this.selectedIndex + 1) % this.creationRecipes.length;
                if (this.creationRecipes.length > 0 && !this.listHidden)
                {
                    document.getElementsByClassName('list-item')[this.selectedIndex].scrollIntoView();
                }
            }
            else if (event.key === 'ArrowUp')
            {
                // Scroll to the next element in the list
                this.listHidden = false;
                if (this.selectedIndex <= 0)
                {
                    this.selectedIndex = this.creationRecipes.length;
                }
                this.selectedIndex = (this.selectedIndex - 1) % this.creationRecipes.length;
                if (this.creationRecipes.length > 0 && !this.listHidden)
                {
                    document.getElementsByClassName('list-item')[this.selectedIndex].scrollIntoView();
                }
            }
        }
    }
}
