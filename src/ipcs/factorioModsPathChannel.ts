import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from './ipcRequest';

export class FactorioModsPathChannel
{
    public static readonly channelName: string = 'mods-path';

    public static handle(event: IpcMainEvent, request: IpcRequest): void
    {
        IconFileProtocol.modsPath = request.params[0];

        event.returnValue = 'success';
    }
}
