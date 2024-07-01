// declare interface bookmarksList {}
// declare interface btnDumpTp {}
// declare interface btnSortByPlanet {}
// declare interface btnTeleport {}
// declare interface lblDebug {}
// declare interface lblDump {}
// declare interface metagui {}

declare const bookmarksList
declare const btnDumpTp
declare const btnSortByPlanet

declare const bookmarkInfo
declare const lblBkmName
declare const lblBkmLocType

declare const btnTeleport
declare const btnFallback
declare const lblDebug
declare const lblDump
declare const metagui
declare interface tpItem {
  id: string,
  children: [
    {id: string, file: string},
    {id: string, text: string},
    {id: string, text: string},
],
  data: {target:string}
}


export {
  metagui,

  bookmarksList,
  btnDumpTp,
  btnSortByPlanet,

  bookmarkInfo,
  lblBkmName,
  lblBkmLocType,

  btnFallback,
  btnTeleport,
  lblDebug,
  lblDump,
};

export type {tpItem};