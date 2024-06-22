//ZA WARUDO
declare module world {
  //SOURCE: game/scripting/StarWorldLuaBindings.cpp

  //Returns the current flight status of a ship world.
  function flyingType():string;

  //Returns the current warp phase of a ship world.
  function warpPhase():string;
}