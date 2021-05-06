"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactorioModsPathChannel = void 0;
var iconFileProtocol_1 = require("../protocols/iconFileProtocol");
var FactorioModsPathChannel = /** @class */ (function () {
    function FactorioModsPathChannel() {
    }
    FactorioModsPathChannel.handle = function (event, request) {
        iconFileProtocol_1.IconFileProtocol.modsPath = request.params[0];
    };
    FactorioModsPathChannel.channelName = 'mods-path';
    return FactorioModsPathChannel;
}());
exports.FactorioModsPathChannel = FactorioModsPathChannel;
//# sourceMappingURL=factorioModsPathChannel.js.map