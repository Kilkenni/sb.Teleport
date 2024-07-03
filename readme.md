# sb.Teleport

A proof-of-concept mod that uses some minor sorcery to reimagine Teleportation UI.

Works entirely on vanilla Lua callbacks.
(and ocassionally hazelnut chocolate)

Work in progress (currently can parse player bookmarks and additional destinations from vanilla teleporter .configs). Planned features will probably be available in Issues. Soon :tm:

## License

TBA

## Requirements

Uses MetaGUI for quick window prototyping. Thus, requires either [Stardust Core](https://github.com/zetaPRIME/sb.StardustSuite) or Stardust Core Lite (former Quickbar Mini) to work (MetaGUI is included in both).

Source code is written in Typescript. Since Starbound can't parse Typescript, it's converted into Lua with [TSTL](https://typescripttolua.github.io/) (TypescriptToLua transpiler).

## Useful links

[Stardust MetaGUI help](https://github.com/zetaPRIME/sb.StardustSuite/tree/master/StardustLib/sys/metagui)

## Credits and Kudos

Used v6's [Handheld Teleporter](https://steamcommunity.com/workshop/filedetails/?id=751199367) as quick hack for triggering the pane

Thanks to [zetaPRIME](https://github.com/zetaPRIME) for help with Stardust MetaGUI
Thanks to Zygan for some friendly Lua advice
Thanks to OpenSb Discord users for support.