/*
Most entity script contexts include the *script* table, which provides bindings for getting and setting the script's update rate. Update deltas are specified in numbers of frames, so a script with an update delta of 1 would run every frame, or a script with an update delta of 60 would run once per second. An update delta of 0 means that the script's periodic update will never be called, but it can still perform actions through script calls, messaging, or event hooks.
*/
declare module script {

  /**
   * Sets the script's update delta.
   * @param dt Delta-tick. 60 dt = 1 second. 0 dt stops auto-update of the script (callbacks, hooks etc still work)
   */
  function setUpdateDelta(dt:number):void; //dt is unsigned int

  /**
   * Returns the script's update delta.
   * @returns Update delta-tick. 60 dt = 1 second. 0 dt means no auto-update.
   */
  function updateDt():number; //unsigned, actually



}