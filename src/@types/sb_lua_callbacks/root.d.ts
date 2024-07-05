/*
The `root` table contains functions that reference the game's currently loaded assets and don't relate to any more specific context such as a particular world or universe.
*/

declare type Image = unknown; //FIXME - can be image OR sub-frame
declare type LuaEngine = unknown; //FIXME

declare module root {
  //SOURCE: game/scripting/StarRootLuaBindings.cpp

  //ASSETS

  /**
   * @param path 
   * @returns Specified asset as stringified bytes (binary) blob
   */
  function assetData(path: string):string;

  /**
   * Only available in OpenStarbound
   * @param path 
   * @returns
   */
  function assetImage(path: string):Image;

  /**
   * Only available in OpenStarbound
   * @param path Relative, should with / which denotes the assets PAK/folder
   * @returns Returns the contents of the specified JSON asset file.
   */
  function assetJson(path: string):JSON;

  /**
   * Only available in OpenStarbound
   * @param engine 
   * @param extension Can start with leading ".", but it is optional
   * @returns array of files in assets/ with the given extension, case-insensitive
   */
  function assetsByExtension(engine: LuaEngine, extension: string):string[]|null;

  /**
   * Only available in OpenStarbound
   * @param path 
   * @returns The source that has the primary asset copy (if found)
   */
  function assetOrigin(path: string):string|null;

  /**
   * Only available in OpenStarbound
   * @param engine 
   * @param path 
   * @returns FIXME patches for the asset and their paths (if found)
   */
  function assetPatches(engine: LuaEngine, path: string):[JSON, string][]|null; //FIXME

  /**
   * Only available in OpenStarbound
   * @param engine 
   * @param withMetadata 
   * @returns Returns an array of all the source assetPaths used by Assets in load order. If requested withMetadata, returns an object indexed with assetPaths.
   */
  function assetSourcePaths(engine: LuaEngine, withMetadata?: boolean): string[]|{[assetPath: string]: JSON};


  /**
   * @param imagePath 
   * @returns Returns the pixel dimensions of the specified image asset.
   */
  function imageSize(imagePath: string):Vec2I; //actually, Vec2U

  /**
   * @param npcType 
   * @returns Returns a representation of the generated JSON configuration for an NPC of the given type.
   */
  function npcConfig(npcType:string):JSON;

  //ITEMS

  /**
   * @param itemName 
   * @returns Returns a list of JSON configurations of all recipes which output the given item.
   */
  function recipesForItem(itemName: string):JSON[];

  /**
   * @param itemName
   * @returns Returns the item type name for the specified item.
   */
  function itemType(itemName: string): string;

  /**
   * @param itemName 
   * @returns Returns a list of the tags applied to the specified item.
   */
  function itemTags(itemName: string):JSON[];

  /**
   * @param itemName 
   * @param tagName 
   * @returns Returns true if the given item's tags include the specified tag and false otherwise.
   */
  function itemHasTag(itemName: string, tagName: string):boolean;



}