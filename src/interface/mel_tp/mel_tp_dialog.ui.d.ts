// declare interface bookmarksList {}
// declare interface btnDumpTp {}
// declare interface btnSortByPlanet {}
// declare interface btnTeleport {}
// declare interface lblDebug {}
// declare interface lblDump {}
// declare interface metagui {}

declare const bookmarksList
declare const txtboxFilter
declare const btnResetFilter
declare const btnSortByPlanet

declare const bookmarkInfo
declare const lblBkmName
declare const lblBkmHazards
declare const listHazards

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

declare interface hazardItem {
  //type: "image",
  file: string,
  //noAutoCrop: true,
  toolTip: string
}

export {
  metagui,

  bookmarksList,
  txtboxFilter,
  btnResetFilter,
  btnSortByPlanet,

  bookmarkInfo,
  lblBkmName,
  lblBkmHazards,
  listHazards,

  btnFallback,
  btnTeleport,
  lblDebug,
  lblDump,
};

export type {tpItem, hazardItem};