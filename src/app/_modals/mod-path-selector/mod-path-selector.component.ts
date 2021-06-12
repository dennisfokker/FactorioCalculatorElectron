import { ModalComponent } from '../../_interfaces/modalComponent';
import { Component, OnInit, Input } from '@angular/core';
import { ModalResult } from '../../_models/modalResult';
import { Observable, Subject } from 'rxjs';
import { ModalService } from '../../_services/modal.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-mod-path-selector',
    templateUrl: './mod-path-selector.component.html',
    styleUrls: ['./mod-path-selector.component.css']
})
export class ModPathSelectorComponent implements OnInit, ModalComponent
{
    @Input() data: any;
    modalClosed: Observable<ModalResult>;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();
    protected modHelpText: string;
    protected modsPath: string;

    constructor(public modalService: ModalService, private deviceService: DeviceDetectorService)
    {
        this.modalClosed = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        this.modHelpText = 'Mods contain information about added/changed items and machines.<br>';

        if (!this.deviceService.isDesktop)
        {
            this.modHelpText += 'Example path: %AppData%\\Factorio\\mods<br>' +
                                'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods';
        }
        else

        {
            switch (this.deviceService.os)
            {
                default:
                case 'UNKNOWN':
                case 'Windows': this.modHelpText += 'Example path: %AppData%\\Factorio\\mods<br>' +
                                                    'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods';
                    break;
                case 'Mac': this.modHelpText += 'Example path: ~/Library/Application Support/factorio/mods';
                    break;
                case 'Linux':
                case 'Unix':
                case 'Chrome-OS': this.modHelpText += 'Example path: ~/.factorio/mods';
                    break;
            }
        }
    }

    onModPathChange(event)
    {
        this.modsPath = undefined;
        if (event.target.files.length > 0)
        {
            const fullPath: string = event.target.files[0].path.replaceAll('\\', '/');
            const relativePath: string = event.target.files[0].webkitRelativePath.replaceAll('\\', '/');
            this.modsPath = fullPath.substring(0, fullPath.length - relativePath.length + relativePath.indexOf('/'));
        }
    }

    onOKClick()
    {
        this.modalClosedSource.next(new ModalResult(false, this.modsPath));
        this.modalService.close();
    }

    onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }
}
