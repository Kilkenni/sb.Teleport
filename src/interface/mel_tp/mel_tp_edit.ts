//manages edit dialog for a bookmark
import * as mel_tp_util from "./mel_tp_util";

const bookmarkState:TeleportBookmark = {
  target: "Nowhere" as unknown as BookmarkTarget,
  targetName: "",
  bookmarkName: "Nowhere in particular",
  icon: "default"
}

// const arr:string[] = ["walnut", "hazelnut"]

// arr[0].search("wal") !== undefined