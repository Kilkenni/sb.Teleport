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
type CelestialCoordString = string
type CelestialWorldId = CelestialCoordString
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

declare type UuidCPP = [ "object", Uuid ]

// declare type CelestialCoordinateJson_no

declare interface CelestialCoordinate {
  location: [int, int, int],
  planet: int,
  satellite: int
}

declare interface CelestialOrbit {
  target: CelestialCoordinate, //coordinates of the planet the ship orbits
  direction: int, //default: 1
  enterTime: double, //default: 0. Time the orbit was entered, universe epoch time
  enterPosition: Vec2F //the position that the orbit was entered at, relative to the target
}


/**
 * At a planet, high-orbiting a planet, at a system object, or at a vector position. Can be nil when in transit
 * The locations are specified as a pair of type and value
 * local location = nil -- Null;
 * location = {"coordinate", {location = system, planet = 1, satellite = 0}} -- CelestialCoordinate;
 * location = {"object", "11112222333344445555666677778888"} -- Object (UUID);
 * location = {0.0, 0.0} -- Vec2F (position in space);
*/
declare type SystemLocationJson = ["coordinate", CelestialCoordinate]|
["orbit", CelestialOrbit]|["object", Uuid]|Vec2F|null;

declare interface CelestialParametersJson { //TODO: Needs better description than that
  imageScale?: float,
  smallImage?: string, //example: "/celestial/system/planet_small.png"
  description?: string, //example: "Tier 2 Planet"
  worldType?:string, //example: "Terrestrial"
  smallImageScale?: float,
  worldSize?: string, //example: "medium",
  terrestrialType:string[] //array of major surface biomes
}

declare interface VisitableParametersJson {
  typeName: string, //default: ""
  threatLevel: float,
  worldSize: Vec2I, //actually, Vec2U, so it's unsigned (non-negative)
  gravity: float, //default: 1.0
  airless: boolean, //default: false
  weatherPool: JSON, //[double,string][]. Weather types with their probabilities
  environmentStatusEffects: JSON, //string[]. May be empty. Write better description?
  overrideTech: JSON; //string[]. May be empty. Write better description?
  globalDirectives: JSON, //Directives[] in JSON form. May be empty. Write better description?
  beamUpRule: "Nowhere"|"Surface"|"Anywhere"|"AnywhereWithWarning", //default: "Surface". BeamUpRuleNames
  disableDeathDrops: boolean, //default: false
  terraformed: boolean, //default: false
  worldEdgeForceRegions: "None"|"Top"|"Bottom"|"TopAndBottom", //default: "None". WorldEdgeForceRegionTypeNames
}