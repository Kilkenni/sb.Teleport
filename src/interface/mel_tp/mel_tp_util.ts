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

export {
  sortArrayByProperty,
  getSpaceLocationType,
}