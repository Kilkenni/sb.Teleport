/**
 * Sorts array by certain property
 * @param array Array of similar objects containing properties with string keys
 * @param propertyName Key to sort objects
 * @param descending If true, sort in descending alphabet order. If false, sort in ascending order.
 * @returns 
 */
function sortArrayByProperty(array:Record<string, any>[], propertyName: string, descending = false):Record<string, string>[] {
  if(array === undefined) {
    return array; //no bookmarks to sort
  }
  let sortedArray = [...array];

  if(sortedArray[0][propertyName] === undefined) {
    return sortedArray; //no such property name, return initial array
  }
  if(descending === false) {
    sortedArray = sortedArray.sort((elem1, elem2) => {return elem1[propertyName].toLowerCase() < elem2[propertyName].toLowerCase()? -1 : 1 })
  }
  else {
    sortedArray = sortedArray.sort((elem1, elem2) => {return elem1[propertyName].toLowerCase() < elem2[propertyName].toLowerCase()? 1 : -1 })
  }
  return sortedArray;
}

enum SystemLocationType {
  null,
  "CelestialCoordinate",
  "CelestialOrbit",
  "Space",
  "FloatingDungeon"
}

function getSpaceLocationType(destination:SystemLocationJson):SystemLocationType {
  if(destination === null) {
    return SystemLocationType.null;
  }
  if(typeof destination[0] === "string") {
    if(destination[0] === "object") {
      return SystemLocationType.FloatingDungeon;
    }
    if(destination[0] === "orbit") {
      return SystemLocationType.CelestialOrbit;
    }
    if(destination[0] === "coordinate") {
      return SystemLocationType.CelestialCoordinate;
    }
    sb.logError(`GetSpaceLocationType: can't identify type, first element is %s`, [destination[0]]);
    return SystemLocationType.null;
  }
  if(typeof destination[0] === typeof destination[1]) {
    return SystemLocationType.Space
  }
  sb.logError(`GetSpaceLocationType: can't identify location type: %s`, [sb.printJson(destination as unknown as JSON)]);
  return SystemLocationType.null;
}

/**
 * Returns stringified CelestialCoordinate back into object
 * @param target Can parse only CelestialWorld
 * @returns CelestialCoordinate or null
 */
function WorldIdToObject(target:WorldIdString):CelestialCoordinate|InstanceWorldId|null {
  if(target.charAt(0) !== "C" && target.charAt(0) !== "I") {
    return null;
  }
  if(target.charAt(0) === "C") {
    const tempTarget = target.substring("CelestialWorld:".length);
    const parsedTarget = tempTarget.split(":");
    const targetCoordinate:CelestialCoordinate = {
    location: [parseInt(parsedTarget[0]) as int, parseInt(parsedTarget[1]) as int, parseInt(parsedTarget[2]) as int],
    planet: parseInt(parsedTarget[3]) as int,
    satellite: parseInt(parsedTarget[4]) as int,
    }
    return targetCoordinate;
  }
  else {
    const tempTarget = target.substring("InstanceWorld:".length);
    const parsedTarget = tempTarget.split(":");
    const targetInstance:InstanceWorldId = {
      instance: parsedTarget[0],
      uuid: parsedTarget[1] || "-",
      level: parseFloat(parsedTarget[2]) as float || "-"
    }
    return targetInstance;
  } 
}

function ObjectToWorldId(target:CelestialCoordinate|InstanceWorldId):WorldIdString {
  if((target as CelestialCoordinate).location !== null) {
    const targetCoord = target as CelestialCoordinate;
    return `CelestialWorld:${Object.values(targetCoord).join(":")}` as WorldIdString;
  }
  else {
    const targetInstance = target as InstanceWorldId;
    return `InstanceWorld:${Object.values(targetInstance).join(":")}` as WorldIdString;
  }
}

export {
  sortArrayByProperty,
  getSpaceLocationType,
  WorldIdToObject,
  ObjectToWorldId
}