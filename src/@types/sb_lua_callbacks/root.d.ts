/*
The `root` table contains functions that reference the game's currently loaded assets and don't relate to any more specific context such as a particular world or universe.
*/

declare module root {
  //SOURCE: TODO

  /**
   * Returns the contents of the specified JSON asset file.
   * @param assetPath Relative, should with / which denotes the assets PAK/folder
   */
  function assetJson(assetPath:string):JSON;


}