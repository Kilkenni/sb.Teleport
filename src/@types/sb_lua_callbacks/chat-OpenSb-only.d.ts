/*
The *chat* table is present only in OpenStarbound!
*/

/** @noSelf **/
declare interface messageConfig {
  mode?: typeof MessageContextModeNames,
  channelName?: string, // only for Local and Party modes
  portrait?: string, //FIXME needs better description
  fromNick?: string, //FIXME needs better description
}

declare module chat {
  //SOURCE: frontend/StarInterfaceLuaBindings.cpp

  /**
   * Sends text message to other players around
   * @param message 
   * @param modeName Chat channel. Can be "Broadcast", "Local" or "Party". Default: Broadcast
   * @param speak Whether to show message in chat log. Default: true, unless message is a console command (starts with /)
   */
  function send(message: string, modeName?: ChatSendMode, speak?: boolean):void;

  /**
   * just for SE compat - this shoulda been a utility callback :moyai:
   * @param args 
   */
  function parseArguments(args: string):JSON[];

  /**
   * Lua wrapper to call Starbound console commands
   * @param command Should start with a /
   * @returns Results of the command
   */
  function command(command:string):string[];

  /**
   * Adds message to chat, optionally using config is present
   * @param text 
   * @param config Can additionally define chat channel, portrait and author of the message
   */
  function addMessage(text: string, config?: messageConfig):void;

  /**
   * @returns text currently present (unsent) in chat input textbox
   */
  function input():string;

  /**
   * Sets chat input to text, but does not send it
   * @param text 
   * @param moveCursor Default: false. Optionally moves cursor to chat textbox
   */
  function setInput(text: string, moveCursor?:boolean):boolean;

  /**
   * Wipes an (optional) amount of last lines from chat history
   * @param count Default: VERY LARGE (basically, clears entire chat log)
   */
  function clear(count?: size_t):void;
}