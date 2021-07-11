import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { app, IpcMainInvokeEvent } from 'electron';
import { IpcRequest } from './ipcRequest';
import * as extractZip from 'extract-zip';
import * as fs from 'fs-extra';
import * as path from 'path';

export class GetFactorioPathChannel
{
    public static readonly channelName: string = 'get-paths';

    public static async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<{factorioPath: string, modsPath: string}>
    {
        return {factorioPath: IconFileProtocol.basePath, modsPath: IconFileProtocol.modsPath};
    }
}
