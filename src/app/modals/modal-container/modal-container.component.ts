import { ModalResult } from '../../models/Helpers/modalResult';
import { ModalService } from './../../services/modal.service';
import { ModalComponent } from './../../interfaces/modalComponent';
import { ModalDirective } from './../../directives/modal.directive';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, Type, ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.css']
})
export class ModalContainerComponent implements OnInit
{
    @ViewChild(ModalDirective, {}) modalContainer: ModalDirective;
    public componentRef: ComponentRef<ModalComponent>;

    constructor(private resolver: ComponentFactoryResolver,
                public modalService: ModalService)
    { }

    ngOnInit()
    {
        this.modalService.setModalContainer(this);
    }

    public open(modal: Type<ModalComponent>, data: any): Observable<ModalResult>
    {
        this.modalContainer.viewContainerRef.clear();
        const factory = this.resolver.resolveComponentFactory(modal);
        this.componentRef = this.modalContainer.viewContainerRef.createComponent(factory);
        this.componentRef.instance.data = data;
        return this.componentRef.instance.modalClosed$;
    }

    public close(): void
    {
        this.componentRef.destroy();
        this.componentRef = null;
    }
}
