import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { app, IpcMainInvokeEvent } from 'electron';
import { IpcRequest } from './ipcRequest';
import * as extractZip from 'extract-zip';
import * as fs from 'fs-extra';
import * as path from 'path';

export class FactorioModsPathChannel
{
    public static readonly channelName: string = 'mods-path';

    public static async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<void>
    {
        IconFileProtocol.modsPath = request.params[0];
        IconFileProtocol.updatePersistentPaths();

        // First make sure we're cleared
        await FactorioModsPathChannel.clearModsCache();

        // Do the actual work
        await FactorioModsPathChannel.cacheMods();

        return;
    }

    private static async clearModsCache(): Promise<void>
    {
        return new Promise<void>(resolve =>
        {
            fs.remove(path.join(app.getPath('userData'), IconFileProtocol.modsCacheFolder), (err: Error) =>
            {
                if (err)
                {
                    console.error('Hit error whilst trying to clear mods cache with error "%s"', err);
                }
                resolve();
            });
        });
    }

    private static async cacheMods(): Promise<void>
    {
        return new Promise<void>(resolve =>
        {
            fs.readdir(IconFileProtocol.modsPath, async (err, dir) =>
            {
                for (const entry of dir)
                {
                    const fileName: string = path.join(IconFileProtocol.modsPath, entry);
                    // Strip away version & extension from file/folder
                    const modName: string = entry.substring(0, entry.lastIndexOf('_'));
                    const cachePath: string = path.join(app.getPath('userData'), IconFileProtocol.modsCacheFolder, modName.toLowerCase());

                    // If mod name is empty, then something went wrong and we'll just ignore whatever happened
                    if (!modName)
                    {
                        console.warn('Could not construct mod name for entr "%s"', entry);
                        continue;
                    }

                    // It's possible for multiple mod versions to be present. Always asume latest in the list is most up to date and that's the entry we want
                    // Thus, since we assume this one is better then whatever's already present, first purge whatever we cached first
                    if (fs.pathExistsSync(cachePath))
                    {
                        try
                        {
                            console.log('Clearing potential older mod version cache for entry "%s"', entry);
                            fs.emptyDirSync(cachePath);
                        }
                        catch (fsErr)
                        {
                            console.error('Hit error for entry "%s" with error "%s"', entry, fsErr);
                        }
                    }

                    if (fs.lstatSync(fileName).isDirectory())
                    {
                        try
                        {
                            console.log('Copying mod entry "%s" as directory', entry);
                            // Directory, just copy the whole thing
                            fs.copySync(fileName, cachePath);
                        }
                        catch (fsErr)
                        {
                            console.error('Hit error for entry "%s" with error "%s"', entry, fsErr);
                        }
                    }
                    else if (entry.endsWith('.zip'))
                    {
                        try
                        {
                            console.log('Copying mod entry "%s" as zip', entry);
                            await extractZip(fileName, { dir: cachePath });

                            // Internal folder name of the mod is inconsistent, but always starts with a root folder. Find this folder (alongside potential clutter)
                            let rawModFolder: string;
                            for (const folder of fs.readdirSync(cachePath))
                            {
                                if (fs.lstatSync(path.join(cachePath, folder)).isDirectory())
                                {
                                    rawModFolder = folder;
                                    console.log('Found entry "%s" their raw folder "%s"', entry, rawModFolder);
                                    break;
                                }
                            }
                            // Zip root is an identical folder, so move the content back out the folder
                            fs.copySync(path.join(cachePath, rawModFolder), cachePath);
                            // Remove the now duplicate folder
                            fs.removeSync(path.join(cachePath, rawModFolder));
                        }
                        catch (fsErr)
                        {
                            console.error('Hit error for entry "%s" with error "%s"', entry, fsErr);
                        }
                    }
                }
                resolve();
            });
        });
    }
}
