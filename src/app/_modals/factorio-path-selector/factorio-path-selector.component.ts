import { ModalComponent } from '../../_interfaces/modalComponent';
import { Component, OnInit, Input } from '@angular/core';
import { ModalResult } from '../../_models/modalResult';
import { Observable, Subject } from 'rxjs';
import { ModalService } from '../../_services/modal.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-factorio-path-selector',
    templateUrl: './factorio-path-selector.component.html',
    styleUrls: ['./factorio-path-selector.component.css']
})
export class FactorioPathSelectorComponent implements OnInit, ModalComponent
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
        // Use Bilka's "Data Raw Serpent" mod: https://mods.factorio.com/mod/DataRawSerpent

        this.dataHelpPath = 'Data contain the information about all available machines, items and recipes to create each item.<br>';
        this.iconHelpPath = 'Icons are used to visualise items and machines.<br>';

        if (!this.deviceService.isDesktop) {
            this.dataHelpPath += 'Example path: %Appdata%\\Factorio\\factorio-current.log';
            this.iconHelpPath += 'Example path: C:\\Program Files\\Steam\\steamApps\\common\\Factorio\\data\\base\\graphics\\icons';
        }
        else
        {
            switch (this.deviceService.os) {
                default:
                case 'UNKNOWN':
                case 'Windows': this.dataHelpPath += 'Example path: %Appdata%\\Factorio\\factorio-current.log<br>' +
                                                        'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\factorio-current.log<br>';
                                this.iconHelpPath += 'Example path: C:\\Program Files\\Steam\\steamApps\\common\\Factorio\\data\\base\\graphics\\icons';
                    break;
                case 'Mac': this.dataHelpPath += 'Example path: ~/Library/Application Support/factorio/factorio-current.log';
                            this.iconHelpPath += 'Example path: ~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents/data/base/graphics/icons';
                    break;
                case 'Linux':
                case 'Unix':
                case 'Chrome-OS': this.dataHelpPath += 'Example path: ~/.factorio/factorio-current.log';
                                  this.iconHelpPath += 'Example path: ~/.factorio/data/base/graphics/icons';
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
