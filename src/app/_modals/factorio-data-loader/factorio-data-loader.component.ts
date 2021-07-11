import { ModelService } from 'app/_services/model.service';
import { DeviceDetectorService } from 'ngx-device-detector';
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
    isLoadingData: boolean = false;
    factorioPathHelpText: string;
    modHelpText: string;
    loadingMessage: string = 'Importing data, this will only take a minute...';

    factorioPath: string;
    modsPath: string;

    protected modalClosedSource: Subject<ModalResult> = new Subject<ModalResult>();

    constructor(private modalService: ModalService,
                private modelService: ModelService,
                private electron: ElectronService,
                private deviceService: DeviceDetectorService)
    {
        this.modalClosed = this.modalClosedSource.asObservable();
    }

    ngOnInit()
    {
        this.constructFactorioAndModsPathHelpText();

        this.factorioPath = this.modelService.factorioPath;
        this.modsPath = this.modelService.modsPath;
    }

    constructFactorioAndModsPathHelpText()
    {
        this.factorioPathHelpText = 'Folder which contains the base Factorio files.<br>';
        this.modHelpText = 'Folder which contains Factorio\'s mods.<br>';

        if (!this.deviceService.isDesktop)
        {
            this.factorioPathHelpText += 'Example path: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio<br>' +
                                     'or C:\\Program Files\\Factorio';
            this.modHelpText += 'Example path: %AppData%\\Factorio\\mods<br>' +
                                'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods';
        }
        else
        {
            switch (this.deviceService.os)
            {
                default:
                case 'UNKNOWN':
                case 'Windows':
                    this.factorioPathHelpText += 'Example path: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio<br>' +
                                                         'or C:\\Program Files\\Factorio';
                    this.modHelpText += 'Example path: %AppData%\\Factorio\\mods<br>' +
                                                    'or C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods';
                    break;
                case 'Mac':
                    this.factorioPathHelpText += 'Example path: ~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents<br>' +
                                                     'or /Applications/factorio.app/Contents';
                    this.modHelpText += 'Example path: ~/Library/Application Support/factorio/mods';
                    break;
                case 'Linux':
                case 'Unix':
                case 'Chrome-OS':
                    this.factorioPathHelpText += 'Example path: ~/.factorio';
                    this.modHelpText += 'Example path: ~/.factorio/mods';
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

    onImportClick()
    {
        this.isLoadingData = true;
        this.modelService.updatePaths(this.factorioPath, this.modsPath).then(() =>
        {
            const request: IpcRequest = { };
            this.electron.ipcRenderer.invoke('data-export', request).then((factorioData) =>
            {
                this.loadingMessage = 'Almost done...';
                // Give the new message a frame to actually render before freezing the UI
                setTimeout(() =>
                {
                    this.modalClosedSource.next(new ModalResult(false, factorioData));
                    this.modalService.close();
                }, 0);
            });
        });
    }

    onCancelClick()
    {
        this.modalClosedSource.next(new ModalResult(true));
        this.modalService.close();
    }
}
