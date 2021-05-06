"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactorioBasePathChannel = void 0;
var iconFileProtocol_1 = require("../protocols/iconFileProtocol");
var FactorioBasePathChannel = /** @class */ (function () {
    function FactorioBasePathChannel() {
    }
    FactorioBasePathChannel.handle = function (event, request) {
        iconFileProtocol_1.IconFileProtocol.basePath = request.params[0];
        event.returnValue = 'success';
    };
    FactorioBasePathChannel.channelName = 'base-path';
    return FactorioBasePathChannel;
}());
exports.FactorioBasePathChannel = FactorioBasePathChannel;
//# sourceMappingURL=factorioBasePathChannel.js.map