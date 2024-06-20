// import {Bookmark} from "../sb_types/bookmark";
declare module player {
  function teleportBookmarks():Bookmark[];
  function warp(warpAction: string, animation?: string):void;
}

// export {
//   teleportBookmarks,
//   warp,
// };