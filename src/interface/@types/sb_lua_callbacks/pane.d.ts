declare module pane {
  //SOURCE: windowing/StarPane.cpp
  /**
   * Returns the entity id of the pane's source entity.
   */
  function sourceEntity():EntityId;

  /**
  * Plays the specified sound asset, optionally looping the specified number of times or at the specified volume.
  * @param sound 
  * @param loops default: 0
  * @param volume default: 1.0
  */
  function playSound(sound: string, loops?: int, volume?: float):void;

  /**
  * Stops all instances of the given sound asset, and returns `true` if any sounds were stopped and `false` otherwise.
  * @param sound sound asset. If none is given, stops TODO what? Noname sound? All sounds? It filters by sound name.
  */
  function stopAllSounds(sound?: string):boolean;
  
  /**
  * Sets the window title and subtitle.
  * @param title 
  * @param subtitle 
  */
  function setTitle(title:string, subtitle:string):void;

  /**
  * Sets the window icon.
  * @param image TODO describe format of name - should it include relative path in assets?
  */
  function setTitleIcon(image:string):void;

  /**
  * Closes the pane. 
  */
  function dismiss():void;

  //TODO CHECK IF THOSE WORK AND WHAT THEY DO
  
  /*
  //possibly register usual widget callbacks for a ScriptPane
  function toWidget():LuaCallbacks; 

  //Relative position, ignoring offset
  function getPosition():Vec2I;

  //Sets new position, ignoring offset
  function setPosition(position:Vec2I):void;
  
  //returns size of the pane
  function getSize():Vec2I;

  //sets new size for the pane
  function setSize(size:Vec2I):void;
  
  //Magic! Adds new widget from config and registers appropriate callbacks. If no name is given, generates stringified random unsigned int64 as one.
  function addWidget(newWidgetConfig:JSON, newWidgetName?:string):LuaCallbacks;
  
  //Returns true if successful. Does NOT work recursively (i.e. does not remove children of a given widget).
  //WARNING! This operation could be expensive. If an element is a pointer, it can (and probably will) lead to memory leaks!
  function removeWidget(widgetName:string):boolean;
  
  //Returns inteface scale
  function scale():int;
  
  //Checks if a pane is currently being displayed (i.e. not dismissed)
  function isDisplayed():boolean;
  */
}