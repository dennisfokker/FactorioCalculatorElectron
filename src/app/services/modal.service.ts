import { ModalResult } from './../models/Helpers/modalResult';
import { ModalContainerComponent } from './../modals/modal-container/modal-container.component';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ModalService
{
    private modalContainer: ModalContainerComponent;

    public setModalContainer(modalContainer: ModalContainerComponent): void
    {
        this.modalContainer = modalContainer;
    }

    public openModal(modal: Type<any>, data: any): Observable<ModalResult>
    {
        return this.modalContainer.open(modal, data);
    }

    public close(): void
    {
        this.modalContainer.close();
    }
}
