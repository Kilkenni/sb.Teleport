local ____exports = {}
--- Sorts array by certain property
-- 
-- @param array Array of similar objects containing properties with string keys
-- @param propertyName Key to sort objects
-- @param descending If true, sort in descending alphabet order. If false, sort in ascending order.
-- @returns
local function sortArrayByProperty(self, array, propertyName, descending)
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
        sortedArray = __TS__ArraySort(
            sortedArray,
            function(____, elem1, elem2)
                return elem1[propertyName]:toLowerCase() < elem2[propertyName]:toLowerCase() and -1 or 1
            end
        )
    else
        sortedArray = __TS__ArraySort(
            sortedArray,
            function(____, elem1, elem2)
                return elem1[propertyName]:toLowerCase() < elem2[propertyName]:toLowerCase() and 1 or -1
            end
        )
    end
    return sortedArray
end
local SystemLocationType = SystemLocationType or ({})
SystemLocationType.null = 0
SystemLocationType[SystemLocationType.null] = "null"
SystemLocationType.CelestialCoordinate = 1
SystemLocationType[SystemLocationType.CelestialCoordinate] = "CelestialCoordinate"
SystemLocationType.CelestialOrbit = 2
SystemLocationType[SystemLocationType.CelestialOrbit] = "CelestialOrbit"
SystemLocationType.Space = 3
SystemLocationType[SystemLocationType.Space] = "Space"
SystemLocationType.FloatingDungeon = 4
SystemLocationType[SystemLocationType.FloatingDungeon] = "FloatingDungeon"
local function getSpaceLocationType(self, destination)
    if destination == nil then
        return SystemLocationType.null
    end
    if type(destination[1]) == "string" then
        if destination[1] == "object" then
            return SystemLocationType.FloatingDungeon
        end
        if destination[1] == "orbit" then
            return SystemLocationType.CelestialOrbit
        end
        if destination[1] == "coordinate" then
            return SystemLocationType.CelestialCoordinate
        end
        sb:logError("GetSpaceLocationType: can't identify type, first element is %s", {destination[0]})
        return SystemLocationType.null
    end
    if __TS__TypeOf(destination[1]) == __TS__TypeOf(destination[2]) then
        return SystemLocationType.Space
    end
    sb:logError(
        "GetSpaceLocationType: can't identify location type: %s",
        {sb:printJson(destination)}
    )
    return SystemLocationType.null
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

--- Returns stringified CelestialCoordinate back into object
-- 
-- @param target Can parse only CelestialWorld
-- @returns CelestialCoordinate or null
function WorldIdToCelestialCoordinate(target)
  --debug
  sb.logInfo("[log] Trying to convert to CelestialCoordinate: "..sb.print(target))
  if(target == nil) then
    return nil
  end
  if string.sub(target, 1, 1) ~= "C" then
      return nil
  end
  
  local tempTarget = string.gsub(target, "CelestialWorld:", "")
  local parsedTarget = stringToArray(tempTarget, ":", "number")
  --debug
  sb.logInfo("[Log] parsed "..sb.printJson(parsedTarget))
  local targetCoordinate = {
      location = {
        parsedTarget[1],
        parsedTarget[2],
        parsedTarget[3],
      },
      planet = parsedTarget[4],
      satellite = parsedTarget[5],
  }
  return targetCoordinate
end
-- ____exports.sortArrayByProperty = sortArrayByProperty
-- ____exports.getSpaceLocationType = getSpaceLocationType
____exports.WorldIdToCelestialCoordinate = WorldIdToCelestialCoordinate
return ____exports
