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

declare const btnEdit
declare const btnTeleport
declare const btnDeploy
declare const btnFallback
declare const lblDebug
declare const lblDump

declare interface tpItem {
  type: "listItem",
  children: [
    {type: "image", file: string},
    {type: "label", text: string},
    {type: "label", text: string},
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
  bookmarksList,
  txtboxFilter,
  btnResetFilter,
  btnSortByPlanet,

  bookmarkInfo,
  lblBkmName,
  lblBkmHazards,
  listHazards,

  btnEdit,
  btnFallback,
  btnTeleport,
  btnDeploy,
  lblDebug,
  lblDump,
};

export type {tpItem, hazardItem};