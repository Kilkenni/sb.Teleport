declare type Vec2I = [number, number]
declare type Vec2F = [number, number]
declare type Vec3I = [number, number, number]
declare type Vec3F = [number, number, number]

declare type EntityId = number & { __brand: "int32_t" };

declare type Uuid = string


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

declare type WarpAction = WarpToWorld|WarpToPlayer|WarpAlias;