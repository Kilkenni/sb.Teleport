//Primitive C++ types
declare type int = number & { __brand: "int" }
declare type float = number & { __brand: "float" }
declare type double = number & { __brand: "double" }

//Vectors
declare type Vec2I = [int, int]
declare type Vec2F = [float, float]
declare type Vec3I = [int, int, int]
declare type Vec3F = [float, float, float]

//Internal Sb types
declare type Uuid = string
declare type EntityId = number & { __brand: "int32_t" };

//Lua-specific wrappers
declare type LuaFunction = Function
declare type LuaTable = Record<string, any>|any[]
declare type LuaValue = null|boolean|int|float|string|LuaTable|LuaFunction //TODO |LuaThread|LuaUserData;

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

declare type WarpAction = ToWorld|WarpToPlayer|WarpAlias;