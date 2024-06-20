# Teleporter Config file

JSON file optionally passed to InteractAction `OpenTeleportDialog` to customize opening Teleport pane. If a .config is not passed, opening dialog proceeds with default values and without any custom `destinations`.

## Structure

    {
    "canBookmark"? : boolean, //default: false
    "canTeleport"? : boolean, //default: true.
    "includePartyMembers"? : boolean, //default: false
    "includePlayerBookmarks"? : boolean, //Default: false
    "destinations" : [
        {
        "name" : string, //equivalent of Bookmark.bookmarkName. Default: ""
        "planetName" : string, //equivalent of Bookmark.targetName. Default: "???"
        "warpAction" : string, //equivalent of Bookmark.target
        "icon" : string, //equivalent of Bookmark.icon
        "deploy"? : boolean, //Deploy mech. Default: false
        "mission"? : boolean, //Default: false
        "prerequisiteQuest"? : //if the player has not completed the quest, destination is not available
        }
    ]
    }

In addition to serialized TeleportTarget (see Bookmark.md), `warpAction` can take following aliases:

- `"Return"` - returns to previous location (unclear)
- `"OrbitedWorld"` - does Warp Down when over a planet
- `"OwnShip"` - warps to player's ship
- `"Player:Uuid"` - warps to another player with corresponding Uuid

Explicitly true `canTeleport` can be used with `canBookmark`=false for locations that cannot be bookmarked but still have usable teleporters (like missions).