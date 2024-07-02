//ZA WARUDO
declare module world {
  //SOURCE: game/scripting/StarWorldLuaBindings.cpp

  //Returns the current flight status of a ship world.
  function flyingType():string;

  //Returns the current warp phase of a ship world.
  function warpPhase():string;

  //TIME

  /**
   * @returns Returns the absolute time of the current world.
   */
  function time():double;

  /**
   * @returns Returns the absolute numerical day of the current world.
   */
  function day():unsigned;

  /**
   * @returns Returns a value between 0 and 1 indicating the time within the day of the current world.
   */
  function timeOfDay():double;

  /**
   * @returns Returns the duration of a day on the current world.
   */
  function dayLength():float;
}