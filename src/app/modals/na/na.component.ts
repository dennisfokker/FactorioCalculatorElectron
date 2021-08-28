import { ModalService } from './../../services/modal.service';
import { ModalResult } from '../../models/Helpers/modalResult';
import { ModalComponent } from './../../interfaces/modalComponent';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-na',
    templateUrl: './na.component.html',
    styleUrls: ['./na.component.css']
})
export class NAComponent implements OnInit, ModalComponent
{
    @Input() data: any;
    modalClosed: Observable<ModalResult>;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    constructor(public modalService: ModalService, private deviceService: DeviceDetectorService)
    {
        this.modalClosed = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
    }

    onOKClick()
    {
        this.modalClosedSource.next(new ModalResult());
        this.modalService.close();
    }
}
