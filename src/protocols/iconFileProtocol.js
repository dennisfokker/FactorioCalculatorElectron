"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconFileProtocol = void 0;
var electron_1 = require("electron");
var path_1 = require("path");
var IconFileProtocol = /** @class */ (function () {
    function IconFileProtocol() {
    }
    IconFileProtocol.iconProtocolHandler = function (request, callback) {
        // Remove protocol
        var url = request.url.replace(this.protocolName + '://', '');
        // Fix folder prefixes (__base__ or __my_mod_name__)
        url = url.replace('__base__', path_1.join(this.basePath, 'data', 'base'));
        url = url.replace('__core__', path_1.join(this.basePath, 'data', 'core'));
        if (!url.startsWith('_')) {
            console.log(url);
        }
        try {
            callback(url);
            return true;
        }
        catch (error) {
            console.error(error);
            callback({ statusCode: 404 });
            return false;
        }
    };
    IconFileProtocol.protocolName = 'factorio-icon';
    IconFileProtocol.basePath = undefined;
    IconFileProtocol.modsPath = undefined;
    // Weird construct to simulate a static constructor
    IconFileProtocol._initialize = (function () {
        // Set default values based on platform if not already set (should always be the case)
        if (!IconFileProtocol.basePath) {
            switch (process.platform) {
                case 'win32':
                    IconFileProtocol.basePath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio';
                    break;
                case 'darwin':
                    IconFileProtocol.basePath = '~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents';
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos':
                    IconFileProtocol.basePath += '~/.factorio';
                    break;
            }
        }
        if (!IconFileProtocol.modsPath) {
            switch (process.platform) {
                case 'win32':
                    IconFileProtocol.modsPath = path_1.join(electron_1.app.getPath('appData'), 'Factorio', 'mods'); // C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods
                    break;
                case 'darwin':
                    IconFileProtocol.modsPath = path_1.join(electron_1.app.getPath('appData'), 'factorio', 'mods'); // ~/Library/Application Support/factorio/mods
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos':
                    IconFileProtocol.modsPath += '~/.factorio/mods';
                    break;
            }
        }
    })();
    return IconFileProtocol;
}());
exports.IconFileProtocol = IconFileProtocol;
//# sourceMappingURL=iconFileProtocol.js.map