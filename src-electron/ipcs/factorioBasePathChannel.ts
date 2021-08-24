import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { IpcMainInvokeEvent } from 'electron';
import { IpcRequest } from './ipcRequest';

export class FactorioBasePathChannel
{
    public static readonly channelName: string = 'base-path';

    public static async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<void>
    {
        IconFileProtocol.basePath = request.params[0];
        IconFileProtocol.updatePersistentPaths();

        return;
    }
}
