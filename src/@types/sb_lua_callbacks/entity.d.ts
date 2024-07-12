/**
 * The *entity* table contains functions that are common among all entities. Every function refers to the entity the script context is running on.
 * Accessible in:
* companion system scripts
* quests
* tech
* primary status script
* status effects
* monsters
* npcs
* objects
* active items
 */

/** @noSelf **/
declare namespace entity {
  //SOURCE: game/scripting/StarEntityLuaBindings.cpp

  /**
   * @returns Returns the id number of the entity.
   */
  function id():EntityId;

  /**
   * @returns Returns a table of the entity's damage team type and team number. Ex: {type = "enemy", team = 0}
   */
  function damageTeam():DamageTeam;

  /**
   * Returns whether the provided entity is a valid target of the current entity.
   * @param target 
   * @returns true if the target exists, can be damaged, and in the case of monsters and NPCs if they are aggressive.
   */
  function isValidTarget(target: EntityId):boolean;

  /**
   * @param target 
   * @returns Returns the vector distance from the current entity to the provided entity.
   */
  function distanceToEntity(target: EntityId):Vec2F;

  /**
   * @param target 
   * @returns Returns whether the provided entity is in line of sight of the current entity.
   */
  function entityInSight(target: EntityId):boolean;

  /**
   * @returns Returns the position of the current entity.
   */
  function position():Vec2F;

  /**
   * @returns Returns the type of the current entity.
   */
  function entityType():typeof EntityTypeNames;

  /**
   * @returns Returns the unique ID of the entity. Returns nil if there is no unique ID.
   * If set, the entity will be discoverable by its unique id and will be indexed in the stored world. Unique ids must be different across all entities in a single world.
   */
  function uniqueId():string;

  /**
   * @returns Returns `true` if the entity is persistent (will be saved to disk on sector unload) or `false` otherwise.
   */
  function persistent():boolean;
}