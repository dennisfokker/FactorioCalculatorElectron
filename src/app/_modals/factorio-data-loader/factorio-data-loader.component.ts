import { ElectronService } from 'ngx-electron';
import { IpcRequest } from './../../../../src-electron/ipcs/ipcRequest';
import { ModalComponent } from '../../_interfaces/modalComponent';
import { Component, OnInit, Input } from '@angular/core';
import { ModalResult } from '../../_models/modalResult';
import { Observable, Subject } from 'rxjs';
import { ModalService } from '../../_services/modal.service';

@Component({
    selector: 'app-factorio-data-loader',
    templateUrl: './factorio-data-loader.component.html',
    styleUrls: ['./factorio-data-loader.component.css']
})
export class FactorioDataLoaderComponent implements OnInit, ModalComponent
{
    @Input() data: any;
    modalClosed: Observable<ModalResult>;
    message: string;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    constructor(private modalService: ModalService,
                private electron: ElectronService)
    {
        this.modalClosed = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        this.message = 'This will only take a minute...';
        const request: IpcRequest = { };
        this.electron.ipcRenderer.invoke('data-export', request).then((factorioData) =>
        {
            this.message = 'Almost done...';
            // Give the new message a frame to actually render before freezing the UI
            setTimeout(() =>
            {
                this.modalClosedSource.next(new ModalResult(false, factorioData));
                this.modalService.close();
            }, 0);
        });
    }
}
