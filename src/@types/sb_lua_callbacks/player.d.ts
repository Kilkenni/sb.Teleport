/**
 * The player table contains functions with privileged access to the player which run in a few contexts on the client such as scripted interface panes, quests, and player companions.
 */

/** @noSelf **/
declare module player {
  //SOURCE: /game/scripting/StarPlayerLuaBindings.cpp

  /**
   * @returns Returns the player's entity id. 
   */
  function id():EntityId;

  /**
   * @returns Returns the player's unique id.
   */
  function uniqueId():string;

  /**
  * @returns Returns stringified Uuid of the player on the server.
  */
  function serverUuid():string;

  /**
   * @returns Returns the player's species.
   */
  function species():string;

  /**
   * @returns Returns the player's gender.
   */
  function gender():string;

  /**
   * @returns Returns whether the player is admin.
   */
  function isAdmin():boolean;

  //QUESTS

  /**
   * Returns `true` if the player meets all of the prerequisites to start the specified quest and `false` otherwise.
   * @param questDescriptor 
   */
  function canStartQuest(questDescriptor:JSON):boolean;

  /**
   * Starts the specified quest, optionally using the specified server Uuid and world id.
   * @param questDescriptor 
   * @param serverUuid 
   * @param worldId 
   * @returns stringified QuestId of the started quest.
   */
  function startQuest(questDescriptor:JSON, serverUuid?:string, worldId?:string):string;

  /**
   * Returns `true` if the player has a quest, in any state, with the specified quest id and `false` otherwise.
   * @param questId 
   */
  function hasQuest(questId: string):boolean;

  /**
   * Returns `true` if the player has accepted a quest (which may be active, completed, or failed) with the specified quest id and `false` otherwise.
   * @param questId 
   */
  function hasAcceptedQuest(questId: string):boolean;

  /**
   * Returns `true` if the player has a currently active quest with the specified quest id and `false` otherwise.
   * @param questId 
   */
  function hasActiveQuest(questId: string):boolean;

  /**
   * Returns `true` if the player has a completed quest with the specified quest id and `false` otherwise.
   * @param questId 
   */
  function hasCompletedQuest(questId: string):boolean;

  
/*

  #### `Maybe<WorldId>` player.currentQuestWorld()

  If the player's currently tracked quest has an associated world, returns the id of that world.

  ---

  #### `List<pair<WorldId, bool>>` player.questWorlds()

  Returns a list of world ids for worlds relevant to the player's current quests, along with a boolean indicating whether that quest is tracked.

  ---

  #### `Maybe<Json>` player.currentQuestLocation()

  If the player's currently tracked quest has an associated location (CelestialCoordinate, system orbit, UUID, or system position) returns that location.

  ---
  */

  /**
   * Returns a list of locations for worlds relevant to the player's current quests, along with a boolean indicating whether that quest is tracked.
   */
  function questLocations():[JSON, boolean][];

  /**
   * Returns `true` if the player has a completed quest with the specified quest id and `false` otherwise. 
   * @param questId 
   */
  function hasCompletedQuest(questId:string): boolean;

  //CHAT

  /**
   * Only available in OpenSb! Triggers chat message as if the player said it. Is not (currently?) shown in chat window.
   * @param message 
   */
  function say(message:string):void;

  /**
   * Triggers an emote on player
   * @param emote Vanilla emotes: Idle, Blabbering, Shouting, Happy, Sad, NEUTRAL, Laugh, Annoyed, Oh, OOOH, Blink, Wink, Eat, Sleep
   * @param cooldown Optionally sets cooldown for emotes to certain value. Otherwise uses default cooldown.
   */
  function emote(emote: string, cooldown?: float):void;

  /**
   * Shows current emote of the player
   * @returns [emote, cooldown] - a pair of emote name and cooldown timer value
   */
  function currentEmote():[string, float];

  //

  /**
   * Returns stringified WorldID of the player's current world.
   */
  function worldId():WorldIdString;

  /**
   * Returns stringified WorldID of the player's ship world.
   */
  function ownShipWorldId():string;

  //CUSTOM PLAYER PROPERTIES

  /**
   * Returns the value assigned to the specified generic player property. If there is no value set, returns defaultValue.
   */
  function getProperty(name: string, defaultValue?: JSON):JSON;

  /**
   * Sets a generic player property to the specified value.
   */
  function setProperty(name: string, value: JSON): void;

  //OBJECT SCANNER

  /**
   * Adds the specified object to the player's scanned objects.
   * @returns FIXME 
   */
  function addScannedObject(name: string): boolean;

  /**
   * Removes the specified object from the player's scanned objects.
   * @param name 
   */
  function removeScannedObject(name: string): void;

  /**
   * Triggers an interact action on the player as if they had initiated an interaction and the result had returned the specified interaction type and configuration. Can be used to e.g. open GUI windows normally triggered by player interaction with entities.
   * @param interactionType 
   * @param config 
   * @param sourceEntityId 
   */
  function interact(interactionType: string, config: JSON|string, sourceEntityId?: EntityId):void;

  /**
   * @returns Returns a JSON object containing information about the player's current ship upgrades including "shipLevel", "maxFuel", "crewSize" and a list of "capabilities".
   */
  function shipUpgrades():JSON;
  
  /**
   * Applies the specified ship upgrades to the player's ship.
   * @param shipUpgrades 
   */
  function upgradeShip(shipUpgrades:JSON):void;

  /**
   * Sets the specified universe flag on the player's current universe.
   * @param flagName 
   */
  function setUniverseFlag(flagName:string):void;

/*
#### `void` player.giveBlueprint(`ItemDecriptor` item)

Teaches the player any recipes which can be used to craft the specified item.

---

#### `void` player.blueprintKnown(`ItemDecriptor` item)

Returns `true` if the player knows one or more recipes to create the specified item and `false` otherwise.

---
*/

  //TECH

  /**
   * Adds the specified tech to the player's list of available (unlockable) techs.
   * @param tech 
   */
  function makeTechAvailable(tech: string):void;

  /**
   * Removes the specified tech from player's list of available (unlockable) techs.
   * @param tech 
   */
  function makeTechUnavailable(tech: string):void;

  /**
   * Unlocks the specified tech, allowing it to be equipped through the tech GUI.
   * @param tech 
   */
  function enableTech(tech: string):void;

  /**
   * Equips the specified tech.
   * @param tech 
   */
  function equipTech(tech: string):void;

  /**
   * Unequips the specified tech.
   * @param tech 
   */
  function unequipTech(tech: string):void;

  /**
   * @returns Returns a list of the techs currently available to the player.
   */
  function availableTechs():string[];

  /**
   * @returns Returns a list of the techs currently unlocked by the player.
   */
  function enabledTechs():string[];

  /**
   * Returns the name of the tech the player has currently equipped in the specified slot, or `nil` if no tech is equipped in that slot.
   * @param slot 
   * @returns Returns the name of the tech the player has currently equipped in the slot, or `nil` if none.
   */
  function equippedTech(slot:string):string;

  //CURRENCY

  /**
   * @param currencyName 
   * @returns Returns the player's current total reserves of the specified currency.
   */
  function currency(currencyName:string):unsigned;

  /**
   * Increases the player's reserve of the specified currency by the specified amount.
   * @param currencyName 
   * @param amount 
   */
  function addCurrency(currencyName:string, amount:unsigned):void;

  /**
   * Attempts to consume the specified amount of the specified currency
   * @param currencyName 
   * @param amount 
   * @returns `true` if successful and `false` otherwise.
   */
  function consumeCurrency(currencyName: string, amount:unsigned):boolean;

  //ITEMS

  /**
   * Triggers an immediate cleanup of the player's inventory, removing item stacks with 0 quantity. May rarely be required in special cases of making several sequential modifications to the player's inventory within a single tick.
   */
  function cleanupItems():void;

  /**
   * Adds the specified item to the player's inventory.
   * @param item 
   */
  function giveItem(item: ItemDescriptor):void;

  /**
   * @param item 
   * @param exactMatch If exactMatch is `true` then parameters as well as item name must match.
   * @returns Returns `true` if the player's inventory contains an item matching the specified descriptor and `false` otherwise. 
   */
  function hasItem(item: ItemDescriptor, exactMatch?: boolean): boolean;

  /**
   * @param item 
   * @param exactMatch If exactMatch is `true` then parameters as well as item name must match.
   * @returns Returns the total number of items in the player's inventory matching the specified descriptor. 
   */
  function hasCountOfItem(item:ItemDescriptor, exactMatch?: boolean):unsigned;

  /**
   * Attempts to consume the specified item from the player's inventory and returns the item consumed if successful. 
   * @param item 
   * @param consumePartial If consumePartial is `true`, matching stacks totalling fewer items than the requested count may be consumed, otherwise the operation will only be performed if the full count can be consumed.
   * @param exactMatch If exactMatch is `true` then parameters as well as item name must match.
   */
  function consumeItem(item: ItemDescriptor, consumePartial?: boolean, exactMatch?: boolean):ItemDescriptor;

  /**
   * @returns Returns a summary of all tags of all items in the player's inventory. Keys in the returned map are tag names and their corresponding values are the total count of items including that tag.
   */
  function inventoryTags(): Map<string, unsigned>;

  /**
   * @returns Returns a list of `ItemDescriptor`s for all items in the player's inventory that include the specified tag.
   */
  function itemsWithTag(tag: string):ItemDescriptor[];

  /**
   * Consumes items from the player's inventory that include the matching tag, up to the specified count of items.
   * @param tag 
   * @param count 
   */
  function consumeTaggedItem(tag: string, count: unsigned):void;

  /**
   * @param parameter 
   * @param value 
   * @returns Returns `true` if the player's inventory contains at least one item which has the specified parameter set to the specified value.
   */
  function hasItemWithParameter(parameter: string, value: JSON):boolean;

  /**
   * Consumes items from the player's inventory that have the specified parameter set to the specified value, up to the specified count of items.
   * @param parameter 
   * @param value 
   * @param count 
   */
  function consumeItemWithParameter(parameter: string, value: JSON, count: unsigned):void;

  /**
   * @param parameter 
   * @param value 
   * @returns Returns the first item in the player's inventory that has the specified parameter set to the specified value, or `nil` if no such item is found.
   */
  function getItemWithParameter(parameter: string, value: JSON):ItemDescriptor|null;

  /**
   * @returns Returns the player's currently equipped primary hand item, or `nil` if no item is equipped.
   */
  function primaryHandItem():ItemDescriptor|null;

  /**
   * @returns Returns the player's currently equipped alt hand item, or `nil` if no item is equipped.
   */
  function altHandItem():ItemDescriptor|null;

  /**
   * @returns Returns a list of the tags on the currently equipped primary hand item, or `nil` if no item is equipped.
   */
  function primaryHandItemTags(): string[]|niull;

  /**
   * @returns Returns a list of the tags on the currently equipped alt hand item, or `nil` if no item is equipped.
  */
  function altHandItemTags(): string[]|null;

  /**
   * @param slotName Essential slot names are "beamaxe", "wiretool", "painttool" and "inspectiontool".
   * @returns Returns the contents of the specified essential slot, or `nil` if the slot is empty. 
   */
  function essentialItem(slotName: string): ItemDescriptor|null;

  /**
   * Sets the contents of the specified essential slot to the specified item.
   * @param slotName 
   * @param item 
   */
  function giveEssentialItem(slotName: string, item: ItemDescriptor): void;

  /**
   * Removes the essential item in the specified slot.
   * @param slotName 
   */
  function removeEssentialItem(slotName: string): void;

  /**
   * @param slotName Equipment slot names are "head", "chest", "legs", "back", "headCosmetic", "chestCosmetic", "legsCosmetic" and "backCosmetic".
   * @returns Returns the contents of the specified equipment slot, or `nil` if the slot is empty.
   */
  function equippedItem(slotName: string): ItemDescriptor|null;

  /**
   * Sets the item in the specified equipment slot to the specified item.
   * @param slotName 
   * @param item 
   */
  function setEquippedItem(slotName: string, item: JSON):void;

  /**
   * @returns Returns the contents of the player's swap (cursor) slot, or `nil` if the slot is empty.
   */
  function swapSlotItem():ItemDescriptor|null;

  /**
   * Sets the item in the player's swap (cursor) slot to the specified item.
   * @param item 
   */
  function setSwapSlotItem(item: JSON):void;

  //MISSION
  
/*
#### `void` player.enableMission(`String` missionName)

Adds the specified mission to the player's list of available missions.

---

#### `void` player.completeMission(`String` missionName)

Adds the specified mission to the player's list of completed missions.

---

#### `void` player.hasCompletedMission(`String` missionName)

Returns whether the player has completed the specified mission.

---

#### `void` player.radioMessage(`Json` messageConfig, [`float` delay])

Triggers the specified radio message for the player, either immediately or with the specified delay.

---

#### `bool` player.lounge(`EntityId` loungeableId, [`unsigned` anchorIndex])

Triggers the player to lounge in the specified loungeable entity at the specified lounge anchor index (default is 0).

---

#### `bool` player.isLounging()

Returns `true` if the player is currently occupying a loungeable entity and `false` otherwise.

---

#### `EntityId` player.loungingIn()

If the player is currently lounging, returns the entity id of what they are lounging in.

---

#### `double` player.playTime()

Returns the total played time for the player.

---

#### `bool` player.introComplete()

Returns `true` if the player is marked as having completed the intro instance and `false` otherwise.

---

#### `void` player.setIntroComplete(`bool` complete)

Sets whether the player is marked as having completed the intro instance.

---
*/
  //TELEPORT

  /**
   * Immediately warps the player to the specified warp target, optionally using the specified warp animation and deployment. 
   * @param warpActionString
   * @param animation Use "default" to get default teleport animation. Full list in assets/player/playereffects.animation, but generally it's 'default', 'beam' or 'deploy'
   * @param deploy Whether to deploy player mech
   */
  function warp(warpActionString: WarpActionString, animation?: string, deploy?: boolean):void;

  /**
   * @returns Returns whether the player has a deployable mech.
   */
  function canDeploy():boolean;

  /**
   * @returns Returns whether the player is currently deployed.
   */
  function isDeployed():boolean;

  //DIALOGUE

  /**
   * Displays a confirmation dialog to the player with the specified dialog configuration
   * @param dialogConfig Json with dialog config or path to it within assets/
   * @returns `RpcPromise` which can be used to retrieve the player's response to that dialog.
   */
  function confirm(dialogConfig:JSON|string):RpcPromise<unknown>;

/*
#### `void` player.playCinematic(`Json` cinematic, [`bool` unique])

Triggers the specified cinematic to be displayed for the player. If unique is `true` the cinematic will only be shown to that player once.

---

#### `void` player.recordEvent(`String` event, `Json` fields)

Triggers the specified event on the player with the specified fields. Used to record data e.g. for achievements.

*/

  //BOOKMARKS

  /**
   * @param coords 
   * @returns Returns whether the player has a bookmark for the specified celestial coordinate.
   */
  function worldHasOrbitBookmark(coords: CelestialCoordinate):boolean;

  /**
   * @returns Returns a list of orbit bookmarks with their system coordinates.
   */
  function orbitBookmarks():[Vec3I, OrbitBookmark][];

  /**
   * @param systemCoordinate 
   * @returns Returns a list of orbit bookmarks in the specified system.
   */
  function systemBookmarks(systemCoordinate: CelestialCoordinate):OrbitBookmark[];

  /**
   * Adds the specified Orbit (Universe Map) bookmark to the player's bookmark list.
   * @param system 
   * @param bookmarkConfig 
   * @returns `true` if the bookmark was successfully added (and was not already known) and `false` otherwise.
   */
  function addOrbitBookmark(system: CelestialCoordinate, bookmarkConfig: OrbitBookmark):void;

  /**
   * Removes the specified Orbit bookmark from the player's bookmark list
   * @param system 
   * @param bookmarkConfig 
   * @returns `true` if the bookmark was successfully removed and `false` otherwise.
   */
  function removeOrbitBookmark(system: CelestialCoordinate, bookmarkConfig:OrbitBookmark):void;

  /**
   * Lists all of the player's teleport bookmarks.
   */
  function teleportBookmarks():TeleportBookmark[];

  /**
   * Adds the specified bookmark to the player's bookmark list
   * @param bookmarkConfig
   * @returns `true` if the bookmark was successfully added (and was not already known) and `false` otherwise.
   */
  function addTeleportBookmark(bookmarkConfig:TeleportBookmark):boolean;

  /**
   * Removes the specified teleport bookmark.
   * @param bookmarkConfig
   * @returns
   */
  function removeTeleportBookmark(bookmarkConfig:TeleportBookmark):boolean;

  //VISITED SYSTEMS

  /**
   * @param coordinate 
   * @returns Returns whether the player has previously visited the specified coordinate.
   */
  function isMapped(coordinate: JSON):boolean;

  /**
   * @param systemCoordinate 
   * @returns Returns uuid, type, and orbits for all system objects in the specified system;
   */
  function mappedObjects(systemCoordinate: JSON):JSON;

  //COLLECTIONS

  /**
   * @param collectionName 
   * @returns Returns a list of names of the collectables the player has unlocked in the specified collection.
   */
  function collectables(collectionName:string):string[];

}