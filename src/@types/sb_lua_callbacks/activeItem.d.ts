/*
The activeItem table contains bindings which provide functionality for the ActiveItem and for the item's 'owner' (a ToolUser entity currently holding the item).
*/

declare module activeItem {
  //SOURCE: TODO

  /**
   * @returns Entity id of the owner entity. Usually, the player holding the item.
   */
  function ownerEntityId():EntityId;

  /**
   * @returns Damage team of the owner entity.
   */
  function ownerTeam():DamageTeam;

  /**
   * @returns World aim position of the owner entity.
   */
  function ownerAimPosition():Vec2F;

  /**
   * @returns Power multiplier of the owner entity.
   */
  function ownerPowerMultiplier():float;

  /**
   * @returns Current fire mode of the item, which can be "none", "primary" or "alt". Single-handed items held in the off hand will receive right click as "primary" rather than "alt".
   */
  function fireMode():string;

  /**
   * @returns Name of the hand that the item is currently held in, which can be "primary" or "alt".
   */
  function hand():string;

  /**
   * Takes an input position relative to the item and returns a position relative to the owner entity.
   * @param offset defaults to [0, 0]
   */
  function handPosition(offset?:Vec2F):Vec2F;

  /**
   * Takes into account the position of the shoulder, distance of the hand from the body, and a lot of other complex factors and should be used to control aimable weapons or tools based on the owner's aim position.
   * @param aimVerticalOffset 
   * @param targetPosition 
   * @returns Table containing the `float` aim angle and `int` facing direction that would be used for the item to aim at the specified target position with the specified vertical offset.
   */
  function aimAngleAndDirection(aimVerticalOffset: float, targetPosition:Vec2F):LuaTable;

  /**
   * Similar to activeItem.aimAngleAndDirection but only returns the aim angle that would be calculated with the entity's current facing direction. Necessary if, for example, an item needs to aim behind the owner.
   * @param aimVerticalOffset 
   * @param targetPosition 
   */
  function aimAngle(aimVerticalOffset:float, targetPosition:Vec2F):float;

  /**
   * Sets whether the owner is visually holding the item.
   * @param holdingItem 
   */
  function setHoldingItem(holdingItem:boolean):void;

  /**
   * Sets the arm image frame that the item should use when held behind the player, or clears it to the default rotation arm frame if no frame is specified.
   * @param armFrame 
   */
  function setBackArmFrame(armFrame?:string):void;

  /**
   * Sets the arm image frame that the item should use when held in front of the player, or clears it to the default rotation arm frame if no frame is specified.
   * @param armFrame 
   */
  function setFrontArmFrame(armFrame?: string):void;

  /**
   * Sets whether the item should be visually held with both hands. Does not alter the functional handedness requirement of the item.
   * @param twoHandedGrip 
   */
  function setTwoHandedGrip(twoHandedGrip:boolean):void;

  /**
   * Sets whether the item is in a recoil state, which will translate both the item and the arm holding it slightly toward the back of the character.
   * @param recoil 
   */
  function setRecoil(recoil:boolean):void;
/*



#### `void` function setOutsideOfHand(`bool` outsideOfHand)

Sets whether the item should be visually rendered outside the owner's hand. Items outside of the hand will be rendered in front of the arm when held in front and behind the arm when held behind.

---

#### `void` function setArmAngle(`float` angle)

Sets the angle to which the owner's arm holding the item should be rotated.

---

#### `void` function setFacingDirection(`float` direction)

Sets the item's requested facing direction, which controls the owner's facing. Positive direction values will face right while negative values will face left. If the owner holds two items which request opposing facing directions, the direction requested by the item in the primary hand will take precedence.

---

#### `void` function setDamageSources([`List<DamageSource>` damageSources])

Sets a list of active damage sources with coordinates relative to the owner's position or clears them if unspecified.

---

#### `void` function setItemDamageSources([`List<DamageSource>` damageSources])

Sets a list of active damage sources with coordinates relative to the item's hand position or clears them if unspecified.

---

#### `void` function setShieldPolys([`List<PolyF>` shieldPolys])

Sets a list of active shield polygons with coordinates relative to the owner's position or clears them if unspecified.

---

#### `void` function setItemShieldPolys([`List<PolyF>` shieldPolys])

Sets a list of active shield polygons with coordinates relative to the item's hand position or clears them if unspecified.

---

#### `void` function setForceRegions([`List<PhysicsForceRegion>` forceRegions])

Sets a list of active physics force regions with coordinates relative to the owner's position or clears them if unspecified.

---

#### `void` function setItemForceRegions([`List<PhysicsForceRegion>` forceRegions])

Sets a list of active physics force regions with coordinates relative to the item's hand position or clears them if unspecified.

---

#### `void` function setCursor([`String` cursor])

Sets the item's overriding cursor image or clears it if unspecified.

---

#### `void` function setScriptedAnimationParameter(`String` parameter, `Json` value)

Sets a parameter to be used by the item's scripted animator.

---

#### `void` function setInventoryIcon(`String` image)

Sets the inventory icon of the item.


*/
  /**
   * Sets an instance value (parameter) of the item.
   * @param parameter 
   * @param value 
   */
  function setInstanceValue(parameter:string, value:JSON):void;

  /**
   * Attempts to call the specified function name with the specified argument values in the context of an ActiveItem held in the opposing hand and synchronously returns the result if successful.
   * @param functionName 
   * @param args 
   */
  function callOtherHandScript(functionName:string, args?:LuaValue[]):LuaValue;

/**
   * Triggers an interact action on the owner as if they had initiated an interaction and the result had returned the specified interaction type and configuration. Can be used to e.g. open GUI windows normally triggered by player interaction with entities.
   * @param interactionType 
   * @param config Additional config or path to it in assets
   * @param sourceEntityId
   */
  function interact(interactionType:string, config:JSON|string, sourceEntityId?: EntityId):void;

  /**
   * Triggers the owner to perform the specified emote.
   * @param emote 
   */
  function emote(emote:string):void;

  /**
   * If the owner is a player, sets that player's camera to be centered on the position of the specified entity, or recenters the camera on the player's position if no entity id is specified.
   * @param entity 
   */
  function setCameraFocusEntity(entity?:EntityId):void;
}