declare interface Bookmark {
  target: string, //<bookmarkType> Holds target of bookmark in parsed form. Can be used as a, well, target for warping.
  targetName: string, //Name of the planet, dungeon instance, etc
  bookmarkName: string, //Human-readable name. Can be edited by the player.
  icon: string,
}

// export {Bookmark};