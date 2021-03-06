import { GetFactorioPathChannel } from './src-electron/ipcs/getFactorioPathsChannel';
import { FactorioDataExportChannel } from './src-electron/ipcs/factorioDataExportChannel';
import { FactorioModsPathChannel } from './src-electron/ipcs/factorioModsPathChannel';
import { FactorioBasePathChannel } from './src-electron/ipcs/factorioBasePathChannel';
import { IconFileProtocol } from './src-electron/protocols/iconFileProtocol';

import { app, BrowserWindow, CustomScheme, ipcMain, protocol, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { ProtocolRequest, ProtocolResponse } from 'electron/main';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function registerIpcChannels()
{
    ipcMain.handle(FactorioBasePathChannel.channelName, FactorioBasePathChannel.handle);
    ipcMain.handle(FactorioModsPathChannel.channelName, FactorioModsPathChannel.handle);
    ipcMain.handle(FactorioDataExportChannel.channelName, FactorioDataExportChannel.handle);
    ipcMain.handle(GetFactorioPathChannel.channelName, GetFactorioPathChannel.handle);
}

function createWindow(): BrowserWindow
{

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow(
        {
            x: 150,
            y: 150,
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            webPreferences:
            {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                backgroundThrottling: false,
                allowRunningInsecureContent: (serve) ? true : false,
                worldSafeExecuteJavaScript: true,
                contextIsolation: false,  // false if you want to run 2e2 test with Spectron
                enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
            },
        });

    if (serve)
    {

        win.webContents.openDevTools();

        require('electron-reload')(__dirname, { electron: require(`${__dirname}/node_modules/electron`) });
        win.loadURL('http://localhost:4200');

    }
    else
    {
        win.loadURL(url.format(
            {
                pathname: path.join(__dirname, 'dist/index.html'),
                protocol: 'file:',
                slashes: true
            }));
    }

    // Emitted when the window is closed.
    win.on('closed', () =>
    {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

try
{
    const factorioIconScheme: CustomScheme = { scheme: IconFileProtocol.protocolName, privileges: { standard: true } };
    protocol.registerSchemesAsPrivileged([factorioIconScheme]);

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () =>
    {
        protocol.registerFileProtocol(IconFileProtocol.protocolName, (request: ProtocolRequest, callback: (response: string | ProtocolResponse) => void) =>
        {
            IconFileProtocol.iconProtocolHandler(request, callback);
        });
        setTimeout(createWindow, 400);
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () =>
    {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin')
        {
            app.quit();
        }
    });

    app.on('activate', () =>
    {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null)
        {
            createWindow();
        }
    });

    registerIpcChannels();
}
catch (e)
{
    // Catch Error
    // throw e;
}
