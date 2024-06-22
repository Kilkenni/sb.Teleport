//Primitive C++ types
declare type int = number & { __brand: "int" }
declare type float = number & { __brand: "float" }
declare type double = number & { __brand: "double" }

//Vectors
declare type Vec2I = [int, int]
declare type Vec2F = [float, float]
declare type Vec3I = [int, int, int]
declare type Vec3F = [float, float, float]

//Box/Rect is an Axis aligned box that can be used as a bounding volume.
declare type RectI = [Vec2I, Vec2I] // min coord, max coord

//Internal Sb types
declare type uint64_t = number & { __brand: "uint64_t" };
declare type Uuid = string
declare type EntityId = number & { __brand: "int32_t" };

//Lua-specific wrappers
declare type LuaFunction = Function
declare type LuaTable = Record<string, any>|any[]
declare type LuaValue = null|boolean|int|float|string|LuaTable|LuaFunction //TODO |LuaThread|LuaUserData;

/* StarSkyTypes */

declare enum SkyTypeName {
  "barren",
  "atmospheric",
  "atmosphereless",
  "orbital",
  "warp",
  "space"
}

declare enum FlyingTypeNames {
  "none",
  "disembarking",
  "warp",
  "arriving"
}

declare enum WarpPhaseNames {
  "slowingdown",
  "maintain",
  "speedingup"
}

/* StarWarping */
type CelestialCoordinate = string
type CelestialWorldId = CelestialCoordinate
type ClientShipWorldId = Uuid
type InstanceWorldId = string|Uuid
declare type WorldId = CelestialWorldId|ClientShipWorldId|InstanceWorldId

type SpawnTargetUniqueEntity = string
type SpawnTargetPosition = `[${string}, ${string}]` //string from Vec2F
type SpawnTargetX = string //string(number)

declare type SpawnTarget = SpawnTargetUniqueEntity|SpawnTargetPosition|SpawnTargetX

declare enum WarpAlias {
  "Return", //returns to previous location (unclear)
  "OrbitedWorld", //does Warp Down when over a planet
  "OwnShip"
}

type ToWorld = {
  world:WorldId,
  target:SpawnTarget,
}

type ToPlayer = Uuid

declare type WarpToPlayer = `Player:${Uuid}`
declare type WarpToWorld = `[CelestialWorld:${ToWorld["world"]}, ${ToWorld["target"]} | undefined]`
//Instance worlds typically have named WorldID and SpawnTarget
declare type WarpToInstance = `InstanceWorld:${ToWorld["world"]}, ${ToWorld["target"]} | undefined]`

declare type WarpAction = ToWorld|WarpToPlayer|WarpAlias;

declare interface CelestialOrbit {
  target: CelestialCoordinate,
  direction: int,
  enterTime: double,
  enterPosition: Vec2F
}

/**
 * At a planet, high-orbiting a planet, at a system object, or at a vector position. Can be nil when in transit
 * The locations are specified as a pair of type and value
 * local location = nil -- Null;
 * location = {"coordinate", {location = system, planet = 1, satellite = 0}} -- CelestialCoordinate;
 * location = {"object", "11112222333344445555666677778888"} -- Object (UUID);
 * location = {0.0, 0.0} -- Vec2F (position in space);
*/
declare type SystemLocation = CelestialCoordinate|CelestialOrbit|Uuid|Vec2F|null;