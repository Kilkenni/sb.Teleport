// declare enum WarpAlias {
//   "Return", //returns to previous location (unclear)
//   "OrbitedWorld", //does Warp Down when over a planet
//   "OwnShip",
//   //"Player:Uuid", //warps to another player with corresponding Uuid
// }

// declare type WarpToPlayer = `Player:${Uuid}`;

declare interface Destination {
  name : string, //equivalent of Bookmark.bookmarkName. Default: ""
  planetName : string, //equivalent of Bookmark.targetName. Default: "???"
  warpAction : WarpAlias|WarpToPlayer|ToWorld, //equivalent of Bookmark.target.
  icon : string, //equivalent of Bookmark.icon
  deploy? : boolean, //Deploy mech. Default: false
  mission? : boolean, //Default: false
  prerequisiteQuest? : any, //if the player has not completed the quest, destination is not available
}

declare interface TeleportConfig  {
  canBookmark : boolean, //default: false
  canTeleport? : boolean, //default: true.
  includePartyMembers? : boolean, //default: false
  includePlayerBookmarks? : boolean, //Default: false
  destinations : Destination[]|undefined, //array of additional destinations
}

// export type {
//   WarpAction,
//   TeleportConfig,
// }

// export default TeleportConfig;