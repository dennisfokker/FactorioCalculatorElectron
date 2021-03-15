# FactorioCalculator

This tool is an Angular-based calculator, running in Electron for certain OS-level features (mainly the file system). A (for now discontinued) [web version](https://github.com/dennisfokker/FactorioCalculator) is also available.

As I couldn't figure out how to actually run the lua scripts through JS/TS, I opted to use (this Factorio mod)[https://github.com/dennisfokker/Factorio-Json-Calculator-Exporter-mod] to spit out a JSON file I can use instead.

## Why Electron and file system access?

The whole point of this tool is to support mods. Now, I won't require the code-portions of mods (as I use the JSON export mod for that), but for nice UI/UX I'd need to support the icons for all the mod items, recipes, etc. Here I *will* require file access, as I just can't be bothered to have users upload their entire mods folder and unzip them in-memory instead.
Electron just makes it easy to keep (mostly) the same code base for both versions, might I decide to keep both running.

## Development server

Run `npm start` for a dev server. This'll run an Angular server at `http://localhost:4200/` and open an Electron instance. The app will automatically reload if you change any of the source files.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. This has been configured to always create an optimised production build.
