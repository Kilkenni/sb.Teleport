// import {Bookmark} from "../sb_types/bookmark";
declare module player {
  //SOURCE?

  /**
   * Returns the player's entity id. 
   */
  function id():EntityId;

  /**
   * Returns `true` if the player has a completed quest with the specified quest id and `false` otherwise. 
   * @param questId 
   */
  function hasCompletedQuest(questId:string): boolean;
  
  /**
   * Returns stringified Uuid of the player on the server.
   */
  function serverUuid():string;

  /**
   * Returns stringified WorldID of the player's current world.
   */
  function worldId():string;

  /**
   * Returns stringified WorldID of the player's ship world.
   */
  function ownShipWorldId():string;

  /**
   * Lists all of the player's teleport bookmarks.
   */
  function teleportBookmarks():Bookmark[];

  /**
   * Adds the specified bookmark to the player's bookmark list and returns `true` if the bookmark was successfully added (and was not already known) and `false` otherwise.
   * @param bookmarkConfig TODO: Improve arg description!
   */
  function addTeleportBookmark(bookmarkConfig:JSON):boolean;

  /**
   * Removes the specified teleport bookmark.
   * @param bookmarkConfig TODO: Improve arg description!
   */
  function removeTeleportBoookmark(bookmarkConfig:JSON):boolean

  /**
   * Immediately warps the player to the specified warp target, optionally using the specified warp animation and deployment. 
   * @param warpAction 
   * @param animation Use "default" to get defalt teleport animation
   * @param deploy Whether to deploy player mech
   */
  function warp(warpAction: string, animation?: string, deploy?: boolean):void;
}