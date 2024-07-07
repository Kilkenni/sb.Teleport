/*
The `root` table contains functions that reference the game's currently loaded assets and don't relate to any more specific context such as a particular world or universe.
*/

declare type Image = unknown; //FIXME - can be image OR sub-frame
declare enum ItemTypeNames {
  "generic",
  "liquid",
  "material",
  "object",
  "currency",
  "miningtool",
  "flashlight",
  "wiretool",
  "beamminingtool",
  "harvestingtool",
  "tillingtool",
  "paintingbeamtool",
  "headarmor",
  "chestarmor",
  "legsarmor",
  "backarmor",
  "consumable",
  "blueprint",
  "codex",
  "inspectiontool",
  "instrument",
  "thrownitem",
  "unlockitem",
  "activeitem",
  "augmentitem",
}
declare interface ItemDescriptor {
  name: string,
  count: unsigned,
  parameters: JSON,
}
declare interface ItemConfig {
  // The relative path in assets to the base config
  directory: string,

  // A possibly modified / generated config from the base config that is
  // re-constructed each time an ItemDescriptor is loaded.  Become's the
  // Item's base config.
  config: JSON,

  // The parameters from the ItemDescriptor, also possibly modified during
  // loading.  Since this become's the Item's parameters, it will be
  // subsequently stored with the Item as the new ItemDescriptor.
  parameters: JSON,
}

/** @noSelf **/
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
  function assetsByExtension(extension: string):string[]|null;

  /**
   * Only available in OpenStarbound
   * @param path 
   * @returns Path to the source that has the primary asset copy (if found)
   */
  function assetOrigin(path: string):string|null;

  /**
   * Only available in OpenStarbound
   * @param engine 
   * @param path 
   * @returns FIXME patches for the asset and their paths (if found)
   */
  function assetPatches(path: string):[JSON, string][]|null; //FIXME

  /**
   * Only available in OpenStarbound
   * @param engine 
   * @param withMetadata 
   * @returns Returns an array of all the source assetPaths used by Assets in load order. If requested withMetadata, returns an object indexed with assetPaths.
   */
  function assetSourcePaths(withMetadata?: boolean): string[]|{[assetPath: string]: JSON};


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
  function recipesForItem(itemName: string):ItemRecipe[];

  /*
  JsonArray LuaBindings::RootCallbacks::allRecipes(Root* root) {
  auto& recipes = root->itemDatabase()->allRecipes();
  JsonArray result;
  result.reserve(recipes.size());
  for (auto& recipe : recipes)
    result.append(recipe.toJson());
  return result;
}
  */

  /**
   * @param itemName
   * @returns Returns the item type name for the specified item.
   */
  function itemType(itemName: string): typeof ItemTypeNames;

  /**
   * @param itemName 
   * @returns Returns a list of the tags applied to the specified item.
   */
  function itemTags(itemName: string):JSON[]; //FIXME

  /**
   * @param itemName 
   * @param tagName 
   * @returns Returns true if the given item's tags include the specified tag and false otherwise.
   */
  function itemHasTag(itemName: string, tagName: string):boolean;

  /**
   * Generates an item from the specified descriptor, level and seed
   * @param descJson 
   * @param level 
   * @param seed 
   * @returns a JSON object containing the `directory`, `config` and `parameters` for that item or NULL (if the item is not found).
   */
  function itemConfig(descJson: ItemDescriptor, level?: float, seed?: unsigned):ItemConfig|null;

  /**
   * Generates an item from the specified descriptor, level and seed and returns a new item descriptor for the resulting item.
   * @param descJson 
   * @param level 
   * @param seed 
   */
  function createItem(descJson: ItemDescriptor, level?: float, seed?: unsigned):ItemDescriptor;
}