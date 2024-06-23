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
  "OrbitingInstance"
}

function getSpaceLocationType(destination:SystemLocationJson):SystemLocationType {
  if(destination === null) {
    return SystemLocationType.null;
  }

  //remove that later
  return SystemLocationType.null;
}

export {
  sortArrayByProperty,
}