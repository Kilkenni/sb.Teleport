# Bookmark

Is a template used for generating two distinct types of bookmarks:

- OrbitTarget, which is a container of `CelestialCoordinate` and `Uuid`
- TeleportTarget, which is a pair (tuple) of `WorldId` and `SpawnTarget`

## Attributes

- `target<bookmarkType>`
Holds type of bookmark in parsed form. Can be used as a, well, target for warping.
- `targetName`
Name of the planet, dungeon instance, etc
- `bookmarkName`
Human-readable name. Can be edited by the player.
- `bookmarkIcon`
Name of file in `assets/interface/bookmarks/icons` used as an icon.