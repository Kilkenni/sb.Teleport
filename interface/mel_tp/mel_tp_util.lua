---@diagnostic disable: undefined-global

--- Sorts array by certain property
-- 
-- @param array Array of similar objects containing properties with string keys
-- @param propertyName Key to sort objects
-- @param descending If true, sort in descending alphabet order. If false, sort in ascending order.
-- @returns
local function sortArrayByProperty(array, propertyName, descending)
    if descending == nil then
        descending = false
    end
    if array == nil then
        return array
    end
    local sortedArray = {table.unpack(array)}
    if sortedArray[1][propertyName] == nil then
        return sortedArray
    end
    if descending == false then
      table.sort(sortedArray,
        function(elem1, elem2) 
          return (string.lower(elem1[propertyName]) < string.lower(elem2[propertyName]) )
        end
      )
    else
      table.sort(sortedArray,
        function(elem1, elem2)
          return ( string.lower(elem1[propertyName]) > string.lower(elem2[propertyName]) )
        end
      )
    end
    return sortedArray
end

local SystemLocationType = {
  "CelestialCoordinate",
  "CelestialOrbit",
  "FloatingDungeon",
  "Space"
}

--- Detects type of space location within a space system
-- 
-- @param destination some location in space (normally, that of a player ship)
-- @returns
local function getSpaceLocationType(destination)
  if destination == nil then
    return nil
  end
  if type(destination[1]) == "string" then
    if destination[1] == "coordinate" then
      return SystemLocationType[1]
    end
    if destination[1] == "orbit" then
      return SystemLocationType[2]
    end
    if destination[1] == "object" then
      return SystemLocationType[3]
    end
    sb.logError("GetSpaceLocationType: can't identify type, first element is %s", {destination[0]})
    return nil
  end
  if type (destination[1]) == type(destination[2]) then
    return SystemLocationType[4]
  end
  sb.logError(
    "GetSpaceLocationType: can't identify location type: %s",
    {sb.printJson(destination)}
  )
  return nil
end

local function stringToArray(inputString, separator, elemType)
  local outputArray = {};

  if( separator == nil) then
    separator = ":"
  end

  for str in string.gmatch(inputString, "([^"..separator.."]+)") do
    if(elemType == "number") then
      table.insert(outputArray, tonumber(str));
    
    else
      --if(elemType == "string" or elemType == nil)
      table.insert(outputArray, str)
    end
  end
  return outputArray
end

local function arrayToString(inputArray, separator)
  local outputString = ""
  for index, element in ipairs(inputArray) do
    outputString = outputString..tostring(element)
    if(index ~= #inputArray) then
      outputString = outputString..":"
    end
  end
  return outputString
end

--- Returns stringified CelestialCoordinate back into object
-- 
-- @param target Can parse CelestialWorld or InstanceWorld
-- @returns CelestialCoordinate or null
local function WorldIdToObject(target)
  if(target == nil) then
    return nil
  end
  if(type(target) == "table") then
    return target
  end
  if string.sub(target, 1, 1) ~= "C" and string.sub(target, 1, 1) ~= "I" then
      return nil
  end

  if string.sub(target, 1, 1) == "C" then
    local tempTarget = string.gsub(target, "CelestialWorld:", "")
    local parsedTarget = stringToArray(tempTarget, ":", "number")
    local targetCoordinate = {
        location = {
          parsedTarget[1],
          parsedTarget[2],
          parsedTarget[3],
        },
        planet = parsedTarget[4],
        satellite = parsedTarget[5]
    }
    return targetCoordinate
  else
    local tempTarget = string.gsub(target, "InstanceWorld:", "")
    local parsedTarget = stringToArray(tempTarget, ":", "string")
    local targetInstance = {
        instance = parsedTarget[1],
        uuid = parsedTarget[2] or "-",
        level = tonumber(parsedTarget[3]) or "-"
    }
    return targetInstance
  end
end

--- Flattens Coordinate/WorldId into string
-- 
-- @param target
-- @returns
local function ObjectToWorldId(target)
    if target.location ~= nil then
      --CelestialCoordinate
        local targetCoord = target
        return "CelestialWorld:" .. arrayToString(
            target.location,
            ":"
        )..":"..(target.planet or 0)..":"..(target.satellite or 0)
    else
      --InstanceWorld
        local targetInstance = target
        return "InstanceWorld:" ..target.instance..":"..(target.uuid or "-")..":"..(target.level or "-")
    end
end

local function WorldIdFullToString(target)
  return sb.printJson(target)
end

local function parseWorldIdFull(target)
  local trimBrackets = string.sub(target, 2, -2)
  return stringToArray(trimBrackets, ",")
end

--TODO test
local function IsBookmarkInstance(target)
  if string.find(target[1], "InstanceWorld") ~= nil then
    return true
  else
    return false
  end
end

local function JsonToDestination(destJson)
  local warpTarget
  if string.find(destJson.warpAction, "InstanceWorld") == nil then
    --WarpAlias
    warpTarget = destJson.warpAction
  else
    local tempTarget = destJson.warpAction
    if string.find(tempTarget, "=") == nil then
      warpTarget = {tempTarget, nil}
    else
      warpTarget = arrayToString(tempTarget, "=")
    end
  end

  return {
      name = destJson.name,
      planetName = destJson.planetName,
      warpAction = warpTarget,
      icon = destJson.icon,
      deploy = destJson.deploy,
      mission = destJson.mission,
      prerequisiteQuest = destJson.prerequisiteQuest
  }
end

local function TargetToWarpCommand(target)
  if type(target) == "string" then
    --WarpAlias
      return target
  end
  if target[1] == "player" then
      return "Player:" .. target[2]
  end
  if target[1] == "object" then
      return "Player:" .. target[2]  --FIXME
  else
      return ((tostring(target[1]) .. "=") .. tostring(target[2])) 
  end
end

--- Filters bookmarks that have "filter" in bookmarkName or targetName
-- 
-- @param bookmarks
-- @param filter string
-- @returns nil for empty filter, new array otherwise
local function FilterBookmarks(bookmarks, filter)
  if filter == "" then
      return nil
  end
  local filteredBookmarks = {}
  for index, bkm in ipairs(bookmarks) do
    if(string.find(string.lower(bkm.bookmarkName), string.lower(filter)) ~= nil or string.find(string.lower(bkm.targetName), string.lower(filter)) ~= nil) then
      filteredBookmarks[#filteredBookmarks + 1] = bkm
    end
  end

  return filteredBookmarks
end

--- Standard check if a table contains an element.
-- 
-- @param table
-- @param element
-- @returns true of false
local function TableContains(luaTable, element)
  for ____, value in ipairs(luaTable) do
    if value == element then
      return true
    end
  end
  return false
end

local function getIconFullPath(iconName)
  return ("/interface/bookmarks/icons/" .. iconName) .. ".png"
end

--- Dialog windows (panes) in SB are akin to template strings in JS. What JS calls placeholders, SB calls "tags". in the text of a window, those are surrounded by unescaped \<angle brackets\>.
-- 
-- @param dialogConfigPath path to vanilla (sic!) dialog pane config (for example, confirmation dialog)
-- @param replaceMap keys are tags (without brackets), values are what to use as replacement
-- @returns
local function fillPlaceholdersInPane(dialogConfigPath, replaceMap)
  local dialogWindowData = root.assetJson(dialogConfigPath)
  for key in pairs(dialogWindowData) do
    if type(dialogWindowData[key]) == "string" then
      dialogWindowData[key] = sb.replaceTags(dialogWindowData[key], replaceMap)
    end
  end
  return dialogWindowData
end

---@diagnostic disable-next-line: lowercase-global
mel_tp_util = {
  sortArrayByProperty = sortArrayByProperty,
  getSpaceLocationType = getSpaceLocationType,
  WorldIdToObject = WorldIdToObject,
  ObjectToWorldId = ObjectToWorldId,
  JsonToDestination = JsonToDestination,
  TargetToWarpCommand = TargetToWarpCommand,
  FilterBookmarks = FilterBookmarks,
  TableContains = TableContains,
  fillPlaceholdersInPane = fillPlaceholdersInPane,
  getIconFullPath = getIconFullPath
}
return mel_tp_util
