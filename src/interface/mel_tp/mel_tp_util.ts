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

const SystemLocationType = [
  "CelestialCoordinate", //0
  "CelestialOrbit", //1
  "FloatingDungeon", //2
  "Space" //3
]

/**
 * Detects type of space location within a space system
 * @param destination some location in space (normally, that of a player ship)
 * @returns 
 */
function getSpaceLocationType(destination:SystemLocationJson):string|null {
  if(destination === null) {
    return null;
  }
  if(typeof destination[0] === "string") {
    if(destination[0] === "coordinate") {
      return SystemLocationType[0];
    }
    if(destination[0] === "orbit") {
      return SystemLocationType[1];
    }
    if(destination[0] === "object") {
      return SystemLocationType[2];
    }  
    sb.logError(`GetSpaceLocationType: can't identify type, first element is %s`, [destination[0]]);
    return null;
  }
  if(typeof destination[0] === typeof destination[1]) {
    return SystemLocationType[3];
  }
  sb.logError(`GetSpaceLocationType: can't identify location type: %s`, [sb.printJson(destination as unknown as JSON)]);
  return null;
}

/**
 * Returns stringified CelestialCoordinate back into object
 * @param target Can parse CelestialWorld or InstanceWorld
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

/**
 * Flattens Coordinate/WorldId into string
 * @param target 
 * @returns 
 */
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

// function WorldIdFullToString(target: BookmarkTarget):WarpToWorld {
//   return sb.printJson(target as unknown as JSON) as WarpToWorld;
// }

// function parseWorldIdFull(target: WarpToWorld): BookmarkTarget {
//   const trimBrackets = target.substring(1, target.length - 1);
//   return trimBrackets.split(",") as BookmarkTarget;
// }

function IsBookmarkInstance(target:BookmarkTarget):boolean {
  return target[0].includes("InstanceWorld");
}

function JsonToDestination(destJson: JsonDestination):Destination {
  let warpTarget:BookmarkTarget|WarpAlias;
  if((destJson.warpAction as string).includes("InstanceWorld") === false) {
    warpTarget = destJson.warpAction as WarpAlias;
  }
  else {
    const tempTarget = destJson.warpAction as InstanceWorldIdStringWithUuid;
    if(tempTarget.includes("=") === false) {
      warpTarget = [tempTarget as InstanceWorldIdString, undefined] as BookmarkTarget;
    }
    else {
      warpTarget = tempTarget.split("=") as BookmarkTarget; //let's hope no configs use = as actual part of the name
    }
  }

  return {
    name : destJson.name,
    planetName : destJson.planetName, //equivalent of Bookmark.targetName. Default: "???"
    warpAction : warpTarget, //equivalent of Bookmark.target.
    icon : destJson.icon, //equivalent of Bookmark.icon
    deploy : destJson.deploy, //Deploy mech. Default: false
    mission : destJson.mission, //Default: false
    prerequisiteQuest : destJson.prerequisiteQuest, //if the player has not completed the quest, destination is not available
  }
}

function TargetToWarpCommand(target: WarpAction):WarpActionString {
  if(typeof target === "string") {
    //WarpAlias
    return target;
  }
  if(target[0] === "player") {
    return `Player:${target[1] as Uuid}`;
  }
  if(target[0] === "object") {
    return `Player:${target[1] as Uuid}`; //FIXME
  }
  else {
    return `${target[0]}=${target[1]}` as WarpToWorld;
  }
}

/**
 * Filters bookmarks that have "filter" in bookmarkName or targetName
 * @param bookmarks 
 * @param filter string
 * @returns undefined for empty filter, new array otherwise
 */
function FilterBookmarks(bookmarks: TeleportBookmark[], filter:string):TeleportBookmark[]|undefined {
  if(filter === "") {
    return undefined;
  }
  let filteredBookmarks:TeleportBookmark[] = [];
  for(const bkm of bookmarks) {
    if(bkm.bookmarkName.toLowerCase().includes(filter.toLowerCase()) || bkm.targetName.toLowerCase().includes(filter.toLowerCase())) {
      filteredBookmarks.push(bkm);
    }
  }
  return filteredBookmarks;
}

/**
 * Standard check if a table contains an element.
 * @param table 
 * @param element 
 * @returns true of false
 */
function TableContains(luaTable:any[], element:any) {
  for(const value of luaTable) {
    if(value === element ){
      return true;
    }
  }
  return false;
}

/**
 * Dialog windows (panes) in SB are akin to template strings in JS. What JS calls placeholders, SB calls "tags". in the text of a window, those are surrounded by unescaped \<angle brackets\>.
 * @param dialogConfigPath path to vanilla (sic!) dialog pane config (for example, confirmation dialog)
 * @param replaceMap keys are tags (without brackets), values are what to use as replacement
 * @returns 
 */
function fillPlaceholdersInPane(dialogConfigPath: string, replaceMap: Map<string, string>) {

  //extract required data from gun structure to replace tags. Returns an object of pairs tag = value
  //should probably refactor and move it closer to gun scripts for cohesion
  /*
  function rangedWeaponTags(gun) {
    const replacementMap: Map<string, string> = {} as Map<string, string>;
    replacementMap["gun_name"] = gun.parameters.shortdescription || "Generic ranged weapon"
    return replacementMap
  }
  */

  const dialogWindowData = root.assetJson(dialogConfigPath)
  //const tags = rangedWeaponTags(dialogTopicObject)
  for(const key in dialogWindowData) {
    if (typeof dialogWindowData[key] === "string") {
      dialogWindowData[key] = sb.replaceTags(dialogWindowData[key], replaceMap)
    }
  }
  return dialogWindowData
}

const mel_tp_util =  {
  sortArrayByProperty,
  getSpaceLocationType,
  WorldIdToObject,
  ObjectToWorldId,
  // parseWorldIdFull,
  JsonToDestination,
  TargetToWarpCommand,
  FilterBookmarks,
  TableContains,
  fillPlaceholdersInPane
}

export default mel_tp_util;

/*
--A number of general functions to work on dialog windows

--Dialog Windows in SB are akin to template strings in JS. What JS calls placeholders, SB calls "tags". in the text of a window, those look like this: <gun_name>.
local function fillPlaceholdersInDialogWindow(dialogConfigPath, dialogTopicObject)

  --extract required data from gun structure to replace tags. Returns an object of pairs tag = value
  --should probably refactor and move it closer to gun scripts for cohesion
  local function rangedWeaponTags(gun)
    return {
      gun_name = gun.parameters.shortdescription or "Generic ranged weapon"
    }
  end

  local dialogWindowData = root.assetJson(dialogConfigPath)
  local tags = rangedWeaponTags(dialogTopicObject)
  for key,value in pairs(dialogWindowData) do
    if type(value) == "string" then
      dialogWindowData[key] = sb.replaceTags(value, tags)
    end
  end
  return dialogWindowData
end

--EXPORT PUBLIC Ra_DialogLib
Ra_DialogLib = {
  fillPlaceholdersInDialogWindow = fillPlaceholdersInDialogWindow
}
*/