import { ProtocolResponse, ProtocolRequest, app } from 'electron';
import { join } from 'path';
import * as Store from 'electron-store';

declare interface PathStore
{
    factorioBasePath: string;
    factorioModsPath: string;
}

export class IconFileProtocol
{
    public static readonly protocolName: string = 'factorio-icon';
    public static readonly modsCacheFolder: string = 'mods cache';
    public static basePath: string = undefined;
    public static modsPath: string = undefined;

    private static store = new Store<PathStore>();

    // Weird construct to simulate a static constructor
    private static _initialize = (() =>
    {
        // Set default values based on platform if not already set (should always be the case)
        if (!IconFileProtocol.basePath)
        {
            // First try to get values from persistent storage
            IconFileProtocol.basePath = IconFileProtocol.store.get('factorioBasePath');

            // Only if persistant storage was empty
            if (!IconFileProtocol.basePath)
            {
                switch (process.platform)
                {
                    case 'win32': IconFileProtocol.basePath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio';
                        break;
                    case 'darwin': IconFileProtocol.basePath = '~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents';
                        break;
                    case 'aix':
                    case 'freebsd':
                    case 'linux':
                    case 'openbsd':
                    case 'sunos': IconFileProtocol.basePath += '~/.factorio';
                        break;
                }
            }
        }

        if (!IconFileProtocol.modsPath)
        {
            // First try to get values from persistent storage
            IconFileProtocol.modsPath = IconFileProtocol.store.get('factorioModsPath');

            // Only if persistant storage was empty
            if (!IconFileProtocol.modsPath)
            {
                switch (process.platform)
                {
                    case 'win32': IconFileProtocol.modsPath = join(app.getPath('appData'), 'Factorio', 'mods'); // C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods
                        break;
                    case 'darwin': IconFileProtocol.modsPath = join(app.getPath('appData'), 'factorio', 'mods'); // ~/Library/Application Support/factorio/mods
                        break;
                    case 'aix':
                    case 'freebsd':
                    case 'linux':
                    case 'openbsd':
                    case 'sunos': IconFileProtocol.modsPath += '~/.factorio/mods';
                        break;
                }
            }
        }
    })();

    public static iconProtocolHandler(request: ProtocolRequest, callback: (response: string | ProtocolResponse) => void): Boolean
    {
        // Remove protocol
        let url = request.url.replace(this.protocolName + '://', '');
        url = decodeURI(url);

        // Fix folder prefixes (__base__ or __my_mod_name__)
        url = url.replace('__base__', join(this.basePath, 'data', 'base'));
        url = url.replace('__core__', join(this.basePath, 'data', 'core'));
        const matches = url.match(/__(.+)__/);
        if (matches)
        {
            url = url.replace(/__(.+)__/, join(app.getPath('userData'), this.modsCacheFolder, matches[1].toLowerCase()));
        }

        try
        {
            callback(url);
            return true;
        }
        catch (error)
        {
            console.error(error);
            callback({ statusCode: 404});
            return false;
        }
    }

    public static updatePersistentPaths()
    {
        IconFileProtocol.store.set('factorioBasePath', IconFileProtocol.basePath);
        IconFileProtocol.store.set
        ('factorioModsPath', IconFileProtocol.modsPath);
    }
}
