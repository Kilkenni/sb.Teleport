// import {Bookmark} from "../sb_types/bookmark";
declare module player {
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
   * 
   */
  function teleportBookmarks():Bookmark[];

  /**
   * Immediately warps the player to the specified warp target, optionally using the specified warp animation and deployment. 
   * @param warpAction 
   * @param animation Use "default" to get defalt teleport animation
   * @param deploy Whether to deploy player mech
   */
  function warp(warpAction: string, animation?: string, deploy?: boolean):void;
}