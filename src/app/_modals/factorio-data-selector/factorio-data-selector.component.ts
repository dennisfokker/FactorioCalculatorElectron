import { ModalComponent } from '../../_interfaces/modalComponent';
import { Component, OnInit, Input } from '@angular/core';
import { ModalResult } from '../../_models/modalResult';
import { Observable, Subject } from 'rxjs';
import { ModalService } from '../../_services/modal.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-factorio-data-selector',
    templateUrl: './factorio-data-selector.component.html',
    styleUrls: ['./factorio-data-selector.component.css']
})
export class FactorioDataSelectorComponent implements OnInit, ModalComponent
{
    private modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    dataHelpPath: string;
    iconHelpPath: string;
    dataFile: File;
    prototypeFiles: File[];
    iconFiles: File[];
    modalClosed: Observable<ModalResult> = this.modalClosedSource.asObservable();
    @Input() data: any;

    constructor(public modalService: ModalService, private deviceService: DeviceDetectorService) { }

    ngOnInit()
    {
        // Use the custom mod: https://mods.factorio.com/mod/JsonCalculatorExporter

        this.dataHelpPath = 'Location of the log file which contains the information about all available machines, items and recipes.<br>';

        if (!this.deviceService.isDesktop) {
            this.dataHelpPath += 'Example path: %Appdata%\\Factorio\\factorio-current.log<br>' +
                                 'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\factorio-current.log';
        }
        else
        {
            switch (this.deviceService.os) {
                default:
                case 'UNKNOWN':
                case 'Windows': this.dataHelpPath += 'Example path: %Appdata%\\Factorio\\factorio-current.log<br>' +
                                                     'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\factorio-current.log';
                    break;
                case 'Mac': this.dataHelpPath += 'Example path: ~/Library/Application Support/factorio/factorio-current.log';
                    break;
                case 'Linux':
                case 'Unix':
                case 'Chrome-OS': this.dataHelpPath += 'Example path: ~/.factorio/factorio-current.log';
                    break;
            }
        }
    }

    onDataFileChange(event)
    {
        this.dataFile = event.target.files.length > 0 ? event.target.files[0] : null;
    }

    onPrototypePathChange(event)
    {
        this.prototypeFiles = event.target.files;
    }

    onIconPathChange(event)
    {
        this.iconFiles = event.target.files;
    }

    onOKClick()
    {
        this.modalClosedSource.next(new ModalResult(false, { dataFile: this.dataFile, prototypeFiles: this.prototypeFiles, iconFiles: this.iconFiles }));
        this.modalService.close();
    }

    onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }
}
