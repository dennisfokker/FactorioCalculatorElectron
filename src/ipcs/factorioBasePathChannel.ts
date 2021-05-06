import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { IpcMainEvent } from 'electron';
import { IpcRequest } from './ipcRequest';

export class FactorioBasePathChannel
{
    public static readonly channelName: string = 'base-path';

    public static handle(event: IpcMainEvent, request: IpcRequest): void
    {
        IconFileProtocol.basePath = request.params[0];

        event.returnValue = 'success';
    }
}
