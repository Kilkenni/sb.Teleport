//Alias: Utility

/** @noSelf **/
declare module sb {
  //source: core/scripting/StarUtilityLuaBindings.hpp

  /**
   * eturns a randomized value with a normal distribution
   * @param stdev standard deviation (default is 1.0)
   * @param mean mean (default is 0)
   */
  function nrand(stdev?:double, mean?:double):double;
  /**
   * Returns a String hex representation of a new, randomly-created Uuid.
   */
  function makeUuid():string;

  /**
   * Logs the specified formatted string, optionally using the formatted replacement values, to the log file and console with the Info log level. 
   * @param str Formatted string using placeholders in format %sVALUE - check it!
   * @param args array of replacement values inserted instead of placeholders
   */
  function logInfo(str:string, args?:LuaValue[]):void;
  function logWarn(str:string, args?:LuaValue[]):void;
  function logError(str:string, args?:LuaValue[]):void;

  //Sets an entry in the debug log map (visible while in debug mode) using the specified format string and optional formatted replacement values. -- REQUIRES BETTER DESCRIPTION
  function setLogMap(key: string, value:string, args?:LuaValue[]):void;

  /**
  * Tries to parse string as a Json. Alias: jsonFromString - SE compat
  * @param str Top level should be Object or Array as per JSON spec
  */
  function parseJson(str:string):JSON;

  /**
   * Returns a human-readable string representation of the specified JSON value. 
   * @param value 
   * @param pretty If pretty > 0, objects will have a newline after each key, and be indented with spaces equal to the amount of pretty. 
   */
  function printJson(value: JSON, pretty?:int):string;

  /**
   * Returns a human-readable string representation of the specified LuaValue. 
   * @param arg Any LuaValue. Careful, breaks when using cyclic LuaValues! (for example, table1 containing table2 containing table1)
   */
  function print(arg:LuaValue):string;

  /**
   * Returns interpolated Vec2F or double between the two specified values using a Sin Ease function. 
   * @param engine of type LuaEngine. inserted automatically? Lua ref does not list that arg
   * @param offset 
   * @param value1 Vec2F or double
   * @param value2 Vec2F or double
   */
  function interpolateSinEase(offset:double, value1:LuaValue, value2:LuaValue):LuaValue;

  /**
   * Replaces tags in the specified string with the specified tag replacement values. If a tag is not found in Map, it is not replaced.
   * @param str Initial string containing tags. Any substring formatted like <TAG> is considered a tag
   * @param tags Map of keys (TAG names) and values (what to replace <TAG> with)
   */
  function replaceTags(str:string, tags:Map<string, string>):string;
  
  /**
   * TODO description
   * @param sequence // Like an array, but without needing the [] or commas.
   */
  function parseJsonSequence(sequence:string):JSON;

  /**
   * Returns the result of merging the contents of "merger" on top of "base": if the same key is present in "base", its value is overwritten.
   * @param base 
   * @param merger
   */
  function jsonMerge(base: JSON, merger: JSON):JSON;

  /**
   * Attempts to extract the value in the specified content at the specified path, and returns the found value or the specified default if no such value exists. 
   * @param json 
   * @param path Where to search content
   * @param def default value if nothing is found
   */
  function jsonQuery(json:JSON, path:string, def:JSON):JSON;

  //TODO
  // callbacks.registerCallback("makeRandomSource", [](Maybe<uint64_t> seed) { return seed ? RandomSource(*seed) : RandomSource(); });
  // callbacks.registerCallback("makePerlinSource", [](Json const& config) { return PerlinF(config); });

}

    
    

   

   
    