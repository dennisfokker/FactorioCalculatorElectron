"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFactorioPathsChannel_1 = require("./src-electron/ipcs/getFactorioPathsChannel");
const factorioDataExportChannel_1 = require("./src-electron/ipcs/factorioDataExportChannel");
const factorioModsPathChannel_1 = require("./src-electron/ipcs/factorioModsPathChannel");
const factorioBasePathChannel_1 = require("./src-electron/ipcs/factorioBasePathChannel");
const iconFileProtocol_1 = require("./src-electron/protocols/iconFileProtocol");
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
let win = null;
const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
function registerIpcChannels() {
    electron_1.ipcMain.handle(factorioBasePathChannel_1.FactorioBasePathChannel.channelName, factorioBasePathChannel_1.FactorioBasePathChannel.handle);
    electron_1.ipcMain.handle(factorioModsPathChannel_1.FactorioModsPathChannel.channelName, factorioModsPathChannel_1.FactorioModsPathChannel.handle);
    electron_1.ipcMain.handle(factorioDataExportChannel_1.FactorioDataExportChannel.channelName, factorioDataExportChannel_1.FactorioDataExportChannel.handle);
    electron_1.ipcMain.handle(getFactorioPathsChannel_1.GetFactorioPathChannel.channelName, getFactorioPathsChannel_1.GetFactorioPathChannel.handle);
}
function createWindow() {
    const electronScreen = electron_1.screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 150,
        y: 150,
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            backgroundThrottling: false,
            allowRunningInsecureContent: (serve) ? true : false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false,
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, { electron: require(`${__dirname}/node_modules/electron`) });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
}
try {
    const factorioIconScheme = { scheme: iconFileProtocol_1.IconFileProtocol.protocolName, privileges: { standard: true } };
    electron_1.protocol.registerSchemesAsPrivileged([factorioIconScheme]);
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', () => {
        electron_1.protocol.registerFileProtocol(iconFileProtocol_1.IconFileProtocol.protocolName, (request, callback) => {
            iconFileProtocol_1.IconFileProtocol.iconProtocolHandler(request, callback);
        });
        setTimeout(createWindow, 400);
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
    registerIpcChannels();
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map