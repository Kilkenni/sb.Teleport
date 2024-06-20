declare module pane {
  // EntityId pane.sourceEntity()
  // Returns the entity id of the pane's source entity. 

  /**
  * Plays the specified sound asset, optionally looping the specified number of times or at the specified volume.
  * @param sound 
  * @param loops 
  * @param volume 
  */
  function playSound(sound: string, loops?: number, volume?: number):void;

  /**
  * Stops all instances of the given sound asset, and returns `true` if any sounds were stopped and `false` otherwise.
  * @param sound 
  */
  function stopAllSounds(sound: string):boolean;
  
  /**
  * Sets the window title and subtitle.
  * @param title 
  * @param subtitle 
  */
  function setTitle(title:string, subtitle:string):void;

  /**
  * Sets the window icon.
  * @param image 
  */
  function setTitleIcon(image:string):void;

  /**
  * Closes the pane. 
  */
  function dismiss():void;
}






// export {
//   playSound,
//   stopAllSounds,
//   setTitle,
//   setTitleIcon,
//   dismiss,
// };

