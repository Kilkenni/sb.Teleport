declare enum WarpAction {
  "Return", //returns to previous location (unclear)
  "OrbitedWorld", //does Warp Down when over a planet
  //"Player:Uuid", //warps to another player with corresponding Uuid
}

declare const WarpToPlayer = "Player:Uuid";

declare interface Destination {
  name : string, //equivalent of Bookmark.bookmarkName. Default: ""
  planetName : string, //equivalent of Bookmark.targetName. Default: "???"
  warpAction : WarpAction|typeof WarpToPlayer|string, //equivalent of Bookmark.target. Can be WarpAction|WarpToPlayer
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
  destinations : Destination[], //array of additional destinations
}

// export type {
//   WarpAction,
//   TeleportConfig,
// }

// export default TeleportConfig;