/*
  OpenStarbound only?
*/

declare type LuaCallbacks = unknown; //FIXME better description
declare type CanvasWidgetPtr = unknown; //FIXME better description

/** @noSelf **/
declare module interface {
//SOURCE: frontend/StarInterfaceLuaBindings.cpp

  /** 
   * @returns whether the HUD is currently visible
  */
  function hudVisible():boolean;

  /**
   * Shows or hides the HUD
   * @param visible 
   */
  function setHudVisible(visible:boolean):void;

  /**
   * 
   * @param canvasName 
   * @param ignoreInterfaceScale Default: false
   * @returns
   */
  function bindCanvas(canvasName: string, ignoreInterfaceScale?: boolean):CanvasWidgetPtr|null;

  /**
   * Tries to attach generic Sb pane callbacks to a registered Pane (if it can be found)
   * @param registeredPaneName 
   * @returns FIXME better description
   */
  function bindRegisteredPane(registeredPaneName: string):LuaCallbacks|null;

  /**
   * Tries to find registered Pane and shows it, if found
   * @param registeredPaneName 
   */
  function displayRegisteredPane(registeredPaneName: string):void;

  /**
   * @returns Current interface scale
   */
  function scale():int;

  function queueMessage(message: string, cooldown?: float, springState?: float): void;
}