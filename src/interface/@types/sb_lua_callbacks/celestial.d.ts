/*
The *celestial* table contains functions that relate to the client sky, flying the player ship, system positions for planets, system objects, and the celestial database. It is available in the following contexts:

* script pane
*/

declare module celestial {
  //SOURCE" game/scripting/StarCelestialLuaBindings.cpp

  /**
   * Whether the client sky is currently flying.
   */
  function skyFlying():boolean;
  
  /**
   * Returns the type of flying the client sky is currently performing.
   * @returns string
   */
  function skyFlyingType():typeof FlyingTypeNames;
  
  /**
   * Returns the current warp phase of the client sky, if warping.
   * @returns string
   */
  function skyWarpPhase():typeof WarpPhaseNames;
 
  
  /**
   * Returns how far through warping the sky is currently.
   * @returns value between 0 and 1
   */
  function skyWarpProgress():float;
  
  /**
   * Returns whether the sky is currently under hyperspace flight.
   */
  function skyInHyperspace():boolean;

  /**
   * Flies the player ship to the specified SystemLocation in the specified system.
   * @param system 
   * @param destination is either of the following types: Null, CelestialCoordinate, Object, Vec2F
   */
  function flyShip(system: Vec3I, destination:SystemLocation):void;

  /**
   * Returns whether the player ship is flying
   */
  function flying():boolean;

  /**
   * Returns the current position of the ship in the system.
   * @returns [float, float] or null - if the system is not initialized
   */
  function shipSystemPosition():Vec2F|null;

  /**
   * Returns the current destination of the player ship.
   */
  function shipDestination():SystemLocation;

  /**
   * Returns the current system location of the player ship.
   */
  function shipLocation():SystemLocation;

  /**
   * Returns the CelestialCoordinate for system the ship is currently in.
   */
  function currentSystem():CelestialCoordinate;

  /**
   * Returns the diameter of the specified planet in system space.
   * @param planet 
   */
  function planetSize(planet:CelestialCoordinate):float;

  /**
   * Returns the position of the specified planet in system space. I.e. converts CelestialCoordinates into [float, float]
   * @param planet 
   */
  function planetPosition(planet:CelestialCoordinate):Vec2F;

/*
#### `CelestialParameters` celestial.planetParameters(`CelestialCoordinate` planet)

Returns the celestial parameters for the specified planet.
---

#### `VisitableParameters` celestial.visitableParameters(`CelestialCoordinate` planet)

Returns the visitable parameters for the specified visitable planet. For unvisitable planets, returns nil.
---

callbacks.registerCallback("planetParameters", [celestialDatabase](Json const& coords) -> Json {
    CelestialCoordinate coordinate = CelestialCoordinate(coords);
    if (auto celestialParameters = celestialDatabase->parameters(coordinate))
      return celestialParameters->parameters();
    return Json();
  });
callbacks.registerCallback("visitableParameters", [celestialDatabase](Json const& coords) -> Json {
    CelestialCoordinate coordinate = CelestialCoordinate(coords);
    if (auto parameters = celestialDatabase->parameters(coordinate)) {
      if (auto visitableParameters = parameters->visitableParameters())
        return visitableParameters->store();
    }
    return {};
  });
*/

  /**
   * Returns the name of the specified planet.
   * @param planet 
   * @returns name if the planet is found
   */
  function planetName(planet:CelestialCoordinate):string|null;

  /**
   * Returns the seed for the specified planet.
   * @param planet 
   * * @returns seed if the planet is found
   */
  function planetSeed(planet:CelestialCoordinate):uint64_t|null;

  /**
   * Returns the diameter of the specified planet and its orbiting moons.
   * @param planet 
   */
  function clusterSize(planet:CelestialCoordinate):float;

  /**
   * Returns a list of ores available on the specified planet.
   * @param planet 
   * @param threatLevel
   * @returns array or ore names oif the planet can be found
   */
  function planetOres(planet:CelestialCoordinate, threatLevel:float):string[]|null;

/*

//Returns the position of the specified location in the *current system*.
function systemPosition(`SystemLocation` location):Vec2F;

Returns the calculated position of the provided orbit.
#### `Vec2F` celestial.orbitPosition(`Orbit` orbit)

```
local orbit = {
  target = planet, -- the orbit target
  direction = 1, -- orbit direction
  enterTime = 0, -- time the orbit was entered, universe epoch time
  enterPosition = {1, 0} -- the position that the orbit was entered at, relative to the target
}
```
callbacks.registerCallback("systemPosition", [systemWorld](Json const& l) -> Maybe<Vec2F> {
  auto location = jsonToSystemLocation(l);
  return systemWorld->systemLocationPosition(location);
});
callbacks.registerCallback("orbitPosition", [systemWorld](Json const& orbit) -> Vec2F {
  return systemWorld->orbitPosition(CelestialOrbit::fromJson(orbit));
});

*/


  /**
   * Returns a list of the Uuids for objects in the current system.
   */
  function systemObjects():Uuid[];

  /**
   * Returns the type of the specified object (if found).
   * @param uuid 
   */
  function objectType(uuid:Uuid):string|null;


  /**
   * Returns the parameters for the specified object in current system (if found).
   * @param 
   * @param uuid 
   */
  function objectParameters(uuid:Uuid):JSON|null;


  /**
   * Returns the warp action world ID for the specified object in current system.
   * @param uuid 
   */
  function objectWarpActionWorld(uuid:Uuid):WorldId|null;


  /**
   * Returns the orbit of the specified object, if any, in current system.
   * @param uuid 
   */
  function objectOrbit(uuid:Uuid):JSON|null;

  /**
   * Returns the position of the specified object, if any, in current system.
   * @param uuid 
   */
  function objectPosition(uuid:Uuid):Vec2F|null;

  /**
   * Returns the configuration of the specified object type.
   * @param typeName type of the object spawned in a celestial system (like a station or a hostile ship)
   */
  function objectTypeConfig(typeName:string):JSON;

/*

#### `Uuid` celestial.systemSpawnObject(`String` typeName, [`Vec2F` position], [`Uuid` uuid], [`Json` parameters])

Spawns an object of typeName at position. Optionally with the specified UUID and parameters.

If no position is specified, one is automatically chosen in a spawnable range.

Objects are limited to be spawned outside a distance of  `/systemworld.config:clientSpawnObjectPadding` from any planet surface (including moons), star surface, planetary orbit (including moons), or permanent objects orbits, and at most within `clientSpawnObjectPadding` from the outermost orbit.
---

callbacks.registerCallback("systemSpawnObject", [systemWorld](String const& typeName, Maybe<Vec2F> const& position, Maybe<String> uuidHex, Maybe<JsonObject> parameters) -> String {
    Maybe<Uuid> uuid = uuidHex.apply([](auto const& u) { return Uuid(u); });
    return systemWorld->spawnObject(typeName, position, uuid, parameters.value({})).hex();
  });
*/

  /**
   * Returns a list of the player ships in the current system.
   */
  function playerShips():Uuid[];

  /**
   * Returns the position of player ship with specified Uuid (if it exists).
   * @param uuid 
   */
  function playerShipPosition(uuid: Uuid):Vec2F|null;

  /**
   * Returns definitively whether the coordinate has orbiting children. `nil` return means the coordinate is not loaded.
   * @param coordinate 
   */
  function hasChildren(coordinate:CelestialCoordinate):boolean|null;

  /**
   * Returns the children for the specified celestial coordinate. For systems, return planets, for planets, return moons.
   * @param coordinate 
   */
  function children(coordinate:CelestialCoordinate):CelestialCoordinate[]

  /**
   * Returns the child orbits for the specified celestial coordinate.
   * @param coordinate 
   */
  function childOrbits(coordinate:CelestialCoordinate):int[]

  /**
   * Returns a list of systems in the given region. If includedTypes is specified, this will return only systems whose typeName parameter is included in the set. This scans for systems asynchronously, meaning it may not return all systems if they have not been generated or sent to the client. Use `scanRegionFullyLoaded` to see if this is the case.
   * @param region 
   * @param includedTypes 
   */
  function scanSystems(region: RectI, includedTypes?: string[]):CelestialCoordinate[];

  /**
   * Returns the constellation lines for the specified universe region.
   * @param region 
   */
  function scanConstellationLines(region: RectI):[Vec2I, Vec2I][];

  /**
   * Returns whether the specified universe region has been fully loaded.
   * @param region 
   */
  function scanRegionFullyLoaded(region:RectI):boolean

  /**
   * Returns the images with scales for the central body (star) for the specified system coordinate.
   * @param system 
   */
  function centralBodyImages(system:CelestialCoordinate):[string, float][];

  /**
   * Returns the smallImages with scales for the specified planet or moon.
   * @param coordinate 
   */
  function planetaryObjectImages(coordinate:CelestialCoordinate):[string, float][];

  /**
   * Returns the generated world images with scales for the specified planet or moon.
   * @param coordinate 
   */
  function worldImages(coordinate:CelestialCoordinate):[string, float][];

  /**
   * Returns the star image for the specified system. Requires a twinkle time to provide the correct image frame.
   * @param system 
   * @param twinkleTime 
   */
  function starImages(system:CelestialCoordinate, twinkleTime:float):[string, float][];

}
