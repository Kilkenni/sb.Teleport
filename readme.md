# sb.Teleport

A proof-of-concept mod that uses some minor sorcery to reimagine Teleportation UI.

Works almost entirely on vanilla Lua callbacks (and ocassionally hazelnut chocolate), but can get additional minor bonuses for OpenSb callbacks.

Work in progress. Planned features will probably be available in Issues. Soon :tm: Feel free to leave your suggestions!

## Installation

Download as a folder and drop to `StarboundLocation/mods`. `/src` folder can be safely removed if you don't need access to source.

## Development

Source code is written in Typescript. Since Starbound doesn't deal with Typescript, it's converted into Lua with [TSTL](https://typescripttolua.github.io/) (Typescript-To-Lua transpiler). The command you'll need for that is `npm run build`.

`prebuild` step is triggered automatically before each `build` to copy any files in `/src` which are _not_ Typescript files into output folder (mod root). This will overwrite the files present there, so be careful.

`/src/@types` folder and any `*.d.ts` files are not transpiled but ignored instead.

Source Typescript files (`*.ts`) are transpiled into `*.lua-raw`. The reason of this is that while I attempted to use TSTL-compatible syntax everywhere, some TS functions have do direct or easily identifiable counterpart in Lua, and traspiler replaces them with non-working stubs (that typically have `_TS_` in names). These need to be rewritten into Lua manually before the files can be run. After this is done, feel free to rename `*.lua-raw` files to simple `*.lua`.

## Known Issues

- Bookmarks are centered, should be aligned to top
- No edit and deletion available in new window (yet)
- Scroll occasionally doesn't work properly (specific to OpenSb only?)
- Tooltips on hazard icons in planet info don't show
- Celestial Database client cache in vanilla Sb is unstable. Possibly fixed in OpenSb, needs verification. Symptom: when a bookmark is selected, planetary info shows `Celestial Database Error`. A workaround is to click other bookmarks until the cache refreshes.

## License

TBA

## Requirements

Uses MetaGUI for quick window prototyping. Thus, requires either [Stardust Core](https://github.com/zetaPRIME/sb.StardustSuite) or Stardust Core Lite (former Quickbar Mini) to work (MetaGUI is included in both).

## Useful links

[Stardust MetaGUI help](https://github.com/zetaPRIME/sb.StardustSuite/tree/master/StardustLib/sys/metagui)

## Credits and Kudos

Used v6's [Handheld Teleporter](https://steamcommunity.com/workshop/filedetails/?id=751199367) as quick hack for triggering the pane

Thanks to [zetaPRIME](https://github.com/zetaPRIME) for help with Stardust MetaGUI
Thanks to Zygan for some friendly Lua advice
Thanks to OpenSb Discord users for support.