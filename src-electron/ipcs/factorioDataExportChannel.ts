import { IconFileProtocol } from '../protocols/iconFileProtocol';
import { IpcMainInvokeEvent, app } from 'electron';
import { IpcRequest } from './ipcRequest';
import { readFile, writeFile, copy, remove, readdir } from 'fs-extra';
import { join } from 'path';
import { exec, ExecException } from 'child_process';

export class FactorioDataExportChannel
{
    public static readonly channelName: string = 'data-export';

    public static async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<Object>
    {
        // First make sure the export mod is added to Factorio
        await FactorioDataExportChannel.applyExportMod();

        // Do the actual work
        const data: Object = await FactorioDataExportChannel.exportData();

        // Don't keep the mods folder cluttered (will likely be disabled by user later anyway)
        await FactorioDataExportChannel.clearExportMod();

        return data;
    }

    private static async applyExportMod()
    {
        // Get the mod list object
        const enabledMods = JSON.parse(await readFile(join(IconFileProtocol.modsPath, 'mod-list.json'), 'utf-8'));

        // Find and edit or add an enabled entry for the export mod
        let found = false;
        for (const mod of enabledMods.mods)
        {
            if (mod.name === 'JsonCalculatorExporter')
            {
                mod.enabled = true;
                found = true;
                break;
            }
        }
        if (!found)
        {
            enabledMods.mods.push({ name: 'JsonCalculatorExporter', enabled: true });
        }

        // Save the new file again
        await writeFile(join(IconFileProtocol.modsPath, 'mod-list.json'), JSON.stringify(enabledMods));

        // Actually drop in the mod itself
        await copy(join('src-electron', 'ExporterMod'), IconFileProtocol.modsPath);
    }

    private static async clearExportMod()
    {
        // Get the mod list object
        const enabledMods = JSON.parse(await readFile(join(IconFileProtocol.modsPath, 'mod-list.json'), 'utf-8'));

        // Remove the entry for the export mod
        enabledMods.mods.forEach((mod, index) =>
        {
            if (mod.name === 'JsonCalculatorExporter')
            {
                enabledMods.mods.splice(index, 1);
            }
        });

        // Save the new file again
        await writeFile(join(IconFileProtocol.modsPath, 'mod-list.json'), JSON.stringify(enabledMods));

        // Delete the actual mod itself
        // First get what folders/files we initially copied
        const modItems: string[] = await readdir(join('src-electron', 'ExporterMod'));
        // Do the removal
        const deletePromises: Promise<void>[] = [];
        for (const modItem of modItems)
        {
            deletePromises.push(remove(join(IconFileProtocol.modsPath, modItem)));
        }
        // Wait for all the files to be deleted
        await Promise.all(deletePromises);
    }

    private static async exportData(): Promise<Object>
    {
        return new Promise<Object>(resolve =>
        {
            const factorioExePath: string = join(IconFileProtocol.basePath, 'bin', 'x64', 'factorio.exe');
            exec(factorioExePath + ' --create ' + join(app.getPath('temp'), app.getName(), 'DataExportMap') + ' --instrument-mod JsonCalculatorExporter', { maxBuffer: 1024 * 1024 * 100 }, (err: ExecException, stdout: string, stderr: string) =>
            {
                // Save stdout as log for debugging purposes
                writeFile(join(app.getPath('temp'), app.getName(), 'previousExport.log'), stdout);

                // First extract the needed data:
                const filterMatch: RegExpMatchArray = stdout.match(/\@__JsonCalculatorExporter__\/instrument-after-data\.lua\:\d+\: ({.+})\r?\n\s+\d+\.\d+ \w/s);
                let rawData: string;
                if (filterMatch && filterMatch.length > 0)
                {
                    rawData = filterMatch[1];
                }
                else
                {
                    console.error('Couldn\'t format output! printing raw:');
                    console.error(stdout);
                }

                // Now it's time for some cleanup. Turn the lua export into valid JSON.
                // Since the calculator requires a mod that already outputs mostly JSON, we don't need to do most of this cleanup
                // Just keeping this here for future reference mostly

                //rawData = rawData.replace(/(?:\[")?(\S+)(?<!"\])(?:"\])? =/g, '"$1":'); // Fix key definitions
                //rawData = rawData.replace(/nil/g, 'null'); // Fix nil to null
                //rawData = rawData.replace(/(,\n(\s+))\{\s*\}/g, '$1{\n$2}'); // Fix empty objects (expand them)
                //rawData = rawData.replace(/-?1\/0 --\[\[-?math\.huge\]\]/g, '-1'); // Fix math operations
                rawData = rawData.replace(/ -?inf/g, 'null'); // Fix math operations
                //rawData = rawData.replace(/(\s+\{\n^(\s+))\{((?:(?!\n\2\})\n^.+)+?\n\2\},\n(?=\s+"))/gm, '$1"anonymous": {$3'); // Fix objects inside objects (nested object brackets are called "anonymous")
                //rawData = rawData.replace(/^((\s+)\{(\n(?!\2\}).+)+?\n\2\}),\n\s+(?!\{|\s|null)[^{\s].*/gm, '$1'); // Fix arrays with loose property at the end
                //rawData = rawData.replace(/\{(\n\s*(\{|null))/g, '[$1'); // Fix array starts
                //while (rawData.search(/(^(\s+)\{(?:(?!\n\2(?:[\}\]]\n|null\n))\n.*)+\n\2(?:[\}\]]|null)\n\s+)\}(?=\n|,\n\s+")/gm) !== -1) {
                //    rawData = rawData.replace(/(^(\s+)\{(?:(?!\n\2(?:[\}\]]\n|null\n))\n.*)+\n\2(?:[\}\]]|null)\n\s+)\}(?=\n|,\n\s+")/gm, '$1]'); // Fix array ends
                //}
                //while (rawData.search(/^(\s+)(\S.+)?(?:\{((?:\n(?!\1\}|.+:).+$)+?\n\1)[\}\]]|[\{\[]((?:\n(?!\1\}|.+:).+$)+?\n\1)\})/gm) !== -1) {
                //    rawData = rawData.replace(/^(\s+)(\S.+)?(?:\{((?:\n(?!\1\}|.+:).+$)+?\n\1)[\}\]]|[\{\[]((?:\n(?!\1\}|.+:).+$)+?\n\1)\})/gm, '$1$2[$3$4]'); // Fix non-object arrays
                //}
                //rawData = rawData.replace(/^(\s+)\}(\n\1\{)/gm, '$1},$2'); // Fix missing commas

                resolve(JSON.parse(rawData));
            });
        });
    }
}
