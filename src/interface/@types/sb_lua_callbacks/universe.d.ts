/*

*/
declare type ConnectionId = uint16_t;
declare type RpcThreadPromise<T> = any; //FIXME

declare module universe {
  //SOURCE: /game/scripting/StarUniverseServerLuaBindings.cpp

  /**
   * Gets a list of client ids
   * @returns A list of numerical client IDs.
   */
  function clientIds():ConnectionId[]
  
  /**
   * Gets the number of logged in clients
   * @return An integer containing the number of logged in clients
   */
   function numberOfClients():size_t; 
  
  /** Returns whether or not the provided client ID is currently connected
   * @param clientId the client ID in question
   * @return A bool that is true if the client is connected and false otherwise
   */
  function isConnectedClient(clientId:ConnectionId):boolean;
  
  /** 
   * Returns the nickname for the given client ID
   * @param clientId the client ID in question
   * @return A string containing the nickname of the given client
   */
  function clientNick(clientId: ConnectionId):string;
  
  /**
   * Returns the client ID for the given nick
   * @param nick the nickname of the client to search for
   * @return An integer containing the clientID of the nick in question OR default ConnectionId
   */
  function findNick(nick:string):ConnectionId;
  
  /**
   * Sends a message to all logged in clients
   * @param message the message to broadcast
   * @return nil
   */
  function adminBroadcast(message:string):void;
  
  /**
   * Sends a message to a specific client
   * @param clientId the client id to whisper
   * @param message the message to whisper
   * @return nil
   */
  function adminWhisper(clientId: ConnectionId, message:string):void;
  
  /**
   * Returns whether or not a specific client is flagged as an admin
   * @param clientId the client id to check
   * @return a boolean containing true if the client is an admin, false otherwise
   */
  function isAdmin(clientId:ConnectionId):boolean;
  
  /**
   * Returns whether or not a specific client is flagged as pvp
   * @param clientId the client id to check
   * @return a boolean containing true if the client is flagged as pvp, false otherwise
   */
  function isPvp(clientId:ConnectionId):boolean;
  
  /**
   * Set (or unset) the pvp status of a specific user
   * @param clientId the client id to check
   * @param setPvp set pvp status to this bool. Default: true
   * @return nil
   */
  function setPvp(clientId:ConnectionId, setPvp?: boolean):void;
  
  function isWorldActive(worldId:string):boolean;
  
  function activeWorlds():string[];
  
  function sendWorldMessage(worldId: string, message: string, args:JSON):RpcThreadPromise<JSON>;
  
  function sendPacket(clientId:ConnectionId, packetTypeName: string, args:JSON):boolean;
  
  function clientWorld(clientId:ConnectionId):string;
}