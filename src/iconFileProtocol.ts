import { ProtocolResponse, ProtocolRequest, app } from 'electron';
import { join } from 'path';

export class IconFileProtocol
{
    public readonly protocolName = 'factorio-icon';

    constructor(public basePath: string = undefined,
        public modsPath: string = undefined)
    {
        // Set default values based on platform
        if (!basePath)
        {
            switch (process.platform)
            {
                case 'win32': this.basePath = 'E:\\SteamLibrary\\steamapps\\common\\Factorio';//'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio';
                    break;
                case 'darwin': this.basePath = '~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents';
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos': this.basePath += '~/.factorio';
                    break;
            }
        }

        if (!modsPath)
        {
            switch (process.platform) {
                case 'win32': this.modsPath = join(app.getPath('appData'), 'Factorio', 'mods'); // C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods
                    break;
                case 'darwin': this.modsPath = join(app.getPath('appData'), 'factorio', 'mods'); // ~/Library/Application Support/factorio/mods
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos': this.modsPath += '~/.factorio/mods';
                    break;
            }
        }
    }

    public iconProtocolHandler(request: ProtocolRequest, callback: (response: string | ProtocolResponse) => void): Boolean
    {
        // Remove protocol
        let url = request.url.replace(this.protocolName + '://', '')

        // Fix folder prefixes (__base__ or __my_mod_name__)
        url = url.replace('__base__', join(this.basePath, 'data', 'base'));
        url = url.replace('__core__', join(this.basePath, 'data', 'core'));

        try {
            callback(url)
            return true;
        }
        catch (error) {
            console.error(error)
            callback({ statusCode: 404});
            return false;
        }
    }
}
