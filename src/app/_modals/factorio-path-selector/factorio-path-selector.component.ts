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
    @Input() data: any;
    modalClosed: Observable<ModalResult>;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();
    protected factorioHelpText: string;
    protected factorioPath: string;

    constructor(public modalService: ModalService, private deviceService: DeviceDetectorService)
    {
        this.modalClosed = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        this.factorioHelpText = 'Folder which contains the base Factorio files. Required for getting the game\'s images.<br>';

        if (!this.deviceService.isDesktop)
        {
            this.factorioHelpText += 'Example path: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio<br>' +
                                     'or C:\\Program Files\\Factorio';
        }
        else
        {
            switch (this.deviceService.os)
            {
                default:
                case 'UNKNOWN':
                case 'Windows': this.factorioHelpText += 'Example path: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio<br>' +
                                                         'or C:\\Program Files\\Factorio';
                    break;
                case 'Mac': this.factorioHelpText += 'Example path: ~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents<br>' +
                                                     'or /Applications/factorio.app/Contents';
                    break;
                case 'Linux':
                case 'Unix':
                case 'Chrome-OS': this.factorioHelpText += 'Example path: ~/.factorio';
                    break;
            }
        }
    }

    onFactorioPathChange(event)
    {
        this.factorioPath = undefined;
        if (event.target.files.length > 0)
        {
            const fullPath: string = event.target.files[0].path.replaceAll('\\', '/');
            const relativePath: string = event.target.files[0].webkitRelativePath.replaceAll('\\', '/');
            this.factorioPath = fullPath.substring(0, fullPath.length - relativePath.length + relativePath.indexOf('/'));
        }
    }

    onOKClick()
    {
        this.modalClosedSource.next(new ModalResult(false, this.factorioPath));
        this.modalService.close();
    }

    onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }
}
