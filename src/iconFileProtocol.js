"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconFileProtocol = void 0;
var electron_1 = require("electron");
var path_1 = require("path");
var IconFileProtocol = /** @class */ (function () {
    function IconFileProtocol(basePath, modsPath) {
        if (basePath === void 0) { basePath = undefined; }
        if (modsPath === void 0) { modsPath = undefined; }
        this.basePath = basePath;
        this.modsPath = modsPath;
        this.protocolName = 'factorio-icon';
        // Set default values based on platform
        if (!basePath) {
            switch (process.platform) {
                case 'win32':
                    this.basePath = 'E:\\SteamLibrary\\steamapps\\common\\Factorio'; //'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Factorio';
                    break;
                case 'darwin':
                    this.basePath = '~/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents';
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos':
                    this.basePath += '~/.factorio';
                    break;
            }
        }
        if (!modsPath) {
            switch (process.platform) {
                case 'win32':
                    this.modsPath = path_1.join(electron_1.app.getPath('appData'), 'Factorio', 'mods'); // C:\\Users\\username\\AppData\\Roaming\\Factorio\\mods
                    break;
                case 'darwin':
                    this.modsPath = path_1.join(electron_1.app.getPath('appData'), 'factorio', 'mods'); // ~/Library/Application Support/factorio/mods
                    break;
                case 'aix':
                case 'freebsd':
                case 'linux':
                case 'openbsd':
                case 'sunos':
                    this.modsPath += '~/.factorio/mods';
                    break;
            }
        }
    }
    IconFileProtocol.prototype.iconProtocolHandler = function (request, callback) {
        // Remove protocol
        var url = request.url.replace(this.protocolName + '://', '');
        // Fix temporairy internal folders
        url = url.replace('__internal__', 'assets/icons');
        // Fix folder prefixes (__base__ or __my_mod_name__)
        url = url.replace('__base__', path_1.join(this.basePath, 'data', 'base'));
        url = url.replace('__core__', path_1.join(this.basePath, 'data', 'core'));
        console.log(url);
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
    return IconFileProtocol;
}());
exports.IconFileProtocol = IconFileProtocol;
//# sourceMappingURL=iconFileProtocol.js.map