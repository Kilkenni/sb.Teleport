declare interface util {
  //FIXME description
  blockSensorTest(sensorGroup, direction):boolean;

  //DIRECTION

  /**
   * @param value 
   * @returns -1 for negative values, +1 for positive
   */
  toDirection(value):(-1|1);

  //VALUE OPTIMIZATION

  /**
   * @param value 
   * @param min 
   * @param max 
   * @returns value or closest to it of (min, max) if it is out of bounds
   */
  clamp(value: number, min: number, max: number):number;

  /**
   * @param value 
   * @param min 
   * @param max
   * @returns value or opposite of closest in (min, max) if it is out of bounds
   */
  wrap(value: number, min: number, max: number):number;

  //ANGLES

  //FIXME
  angleDiff(from:number, to: number);
 
  //DECIMALS

  /**
   * Rounds num to idp digits after decimal point
   * @param num 
   * @param idp 
   */
  round(num: number, idp: number):number;
  
  //SWITCH INDEXES

  /**
   * Increases value up to max or resets it to 1
   * @param value 
   * @param max 
   */
  incWrap(value:number, max: number):number;
  
  //ANGLE OPTIMIZATION

  /**
   * Converts angle to (0, 2*pi) range.
   * @param angle in radians
   */
  wrapAngle(angle: number):number;
  
  //DIMENSIONAL

  /**
   * @param polygon as array of [x, y] vertices
   * @returns bounding box for a polygon of random shape.
   */
  boundBox(polygon:Vec2F[]):[number, number, number, number];

  /**
   * @param pos 
   * @returns coords of center of the tile in which pos is
   */
  tileCenter(pos: Vec2F):Vec2F;

  //ARRAY METHODS - mostly similar to JS Array methods, fith a few quirks

  /**
   * A non-mutating filter that leave out only elements fulfilling the predicate
   * @param table array of values
   * @param predicate condition for filtration. Takes in an element of <table>, returns boolean
   * @returns new array
   */
  filter(table: any[], predicate: Function):any[];

  /**
   * Checks if <index> elements with within an array fulfill the predicate
   * @param table array of values
   * @param predicate Condition for search. Takes in an element of <table>, returns boolean
   * @param index Should lie in range of 1..table.length. Default: 1.
   * @returns Last element that fulfills the condition, NIL if array does not have <index> valid elements
   */
  find(table: any[], predicate: Function, index?: number):[any, unsigned]|null;

  /**
   * Similar to JavaScript's forEach, runs a function on every element of an array
   * @param table 
   * @param func 
   */
  each(table: any[], func: Function):void;
 
  /**
   * Similar to JavaScript's Object.keys()
   * @param table some object
   * @param func 
   * @returns array of keys
   */
  keys(table:{[key: string]: any}, func:Function):string[];

  /**
   * Creates an array of "n" size with elements generated by func
   * @param func 
   * @param n 
   */
  rep(func: Function, n: int):any[];

  /**
   * Maps table by running func on each element and writes results in newTable
   * @param table 
   * @param func Takes in a single element of the <table>
   * @param newTable If not provided, returns a new table
   */
  map(table:{[key: string]: any}, func: Function, newTable?: {[key: string]: any}): {[key: string]: any};
  
  /**
   * @param table object or array
   * @param value 
   * @returns How much times value occurs in table. If never, returns 0
   */
  count(table: {[key: string]: any}, value: any): unsigned;
  
  /**
   * Similar to JavaScript's array.reduce()
   * @param table object or array
   * @param accumulator
   * @param func A function that takes in accumulator and a single value of <table> and returns new accumulator value
   */
  fold(table: {[key: string]: any}, accumulator: any, func: Function): any;
  
  /**
   * Similar to map, but func can process keys
   * @param table 
   * @param func Takes in a key from <table> and a corresponding value, returns new value
   * @param newTable If not provided, returns a new table
   */
  mapWithKeys(table: {[key: string]: any}, func: Function, newTable: {[key: string]: any}):{[key: string]: any};
 
  /**
   * Interates on all keys in tbl1, tbl2 and runs func on each pair of values. Records results in new object
   * @param tbl1 
   * @param tbl2 
   * @param func Is called for each pair only once. One value can be NIL (if a key is present in only one of the tables)
   * @param newTable 
   */
  zipWith(tbl1: {[key: string]: any}, tbl2: {[key: string]: any}, func: Function, newTable: {[key: string]: any}): {[key: string]: any}
  
  /**
   * Similar to JavaScript's Object.values(), returns an array of values in <table>
   * @param table 
   */
  toList(table: {[key: string]: any}):any[];
  
  /**
   * Trims array to the size of n (i.e. takes the first "n" elements from it and returns as a new array)
   * @param n
   * @param list 
   */
  take(n: unsigned, list: any[]):any[];
  
  /**
   * Same to take(), trims array to the size of n, but takes the _last_ "n" elements. Order of elements in the result is not changed.
   * @param list 
   * @param n 
   */
  takeEnd(list: any[], n: unsigned):any[];

  //
/*
function util.trackTarget(distance, switchTargetDistance, keepInSight)
  local targetIdWas = self.targetId

  if self.targetId == nil then
    self.targetId = util.closestValidTarget(distance)
  end

  if switchTargetDistance ~= nil then
    // Switch to a much closer target if there is one
    local targetId = util.closestValidTarget(switchTargetDistance)
    if targetId ~= 0 and targetId ~= self.targetId then
      self.targetId = targetId
    end
  end

  util.trackExistingTarget(keepInSight)

  return self.targetId ~= targetIdWas and self.targetId ~= nil
end

function util.nearestPosition(positions)
  local bestDistance = nil
  local bestPosition = nil
  for _,position in pairs(positions) do
    local distance = world.magnitude(position, entity.position())
    if not bestDistance or distance < bestDistance then
      bestPosition = position
      bestDistance = distance
    end
  end
  return bestPosition
end

function util.closestValidTarget(range)
  local newTargets = world.entityQuery(entity.position(), range, { includedTypes = {"player", "npc", "monster"}, order = "nearest" })
  local valid = util.find(newTargets, function(targetId) return entity.isValidTarget(targetId) and entity.entityInSight(targetId) end)
  return valid or 0
end

  //
function util.trackExistingTarget(keepInSight)
  if keepInSight == nil then keepInSight = true end

  // Lose track of the target if they hide (but their last position is retained)
  if self.targetId ~= nil and keepInSight and not entity.entityInSight(self.targetId) then
    self.targetId = nil
  end

  if self.targetId ~= nil then
    self.targetPosition = world.entityPosition(self.targetId)
  end
end
*/

  //

  /**
   * Exactly what it says on the tin, forward or backward
   */
  randomDirection():(-1|1);
  
  /**
   * Generates a "recurring" function that can be called every once in an <interval>
   * @param interval Frequiency of calling func repeatedly
   * @param func 
   * @param initialInterval If present, is taken as an initial interval
   * @returns func wrapped in (dt) timer that can be triggered each <interval>
   */
  interval(interval: number, func: Function, initialInterval?: number):Function;

  /**
   * Wrapper for world.findUniqueEntity. FIXME needs better description
   * @param uniqueId 
   * @param interval Default: 0
   */
  uniqueEntityTracker(uniqueId: string, interval?: unsigned):Vec2F;

/*
  multipleEntityTracker(uniqueIds: string[], interval, choiceCallback)
  choiceCallback = choiceCallback or util.nearestPosition

  local trackers = {}
  for _,uniqueId in pairs(uniqueIds) do
    table.insert(trackers, util.uniqueEntityTracker(uniqueId, interval))
  end

  return coroutine.wrap(function()
      local positions = {}
      while true do
        for i,tracker in pairs(trackers) do
          local position = tracker()
          if position then
            positions[i] = position
          end
        end

        local best = choiceCallback(util.toList(positions))
        coroutine.yield(best)
      end
    end)
end*/

  //PAUSE AND POSTPONE

  /**
   * Useful in coroutines to wait for the given duration, optionally performing some action each update. Yields false.
   * @param duration in delta ticks. 1 dt = 1/60 sec
   * @param action Function taking in a single "dt" arg
   */
  wait(duration: unsigned, action?: Function):void;

  /**
   * version of util.wait that yields nil instead of false for when you don't want to yield false and instead want to yield nil
   * @param duration in delta ticks
   * @param action Function(dt). Is run every update.
   * @param $vararg 
   */
  run(duration: unsigned, action: Function, ...$vararg):void;

  //COROUTINES

  /**
   * Run coroutines or functions in parallel until at least one coroutine is dead
   * @param coroutines 
   */
  parallel(coroutines: Function[]):boolean;

  /**
   * FIXME
   * @param func 
   */
  untilNotNil(func: Function):Function;
/*
function util.untilNotEmpty(func)
  local v
  while true do
    v = func()
    if v ~= nil and #v > 0 then return v end
    coroutine.yield()
  end
end

  //
function util.hashString(str)
  // FNV-1a algorithm. Simple and fast.
  local hash = 2166136261
  for i = 1, #str do
    hash = hash ~ str:byte(i)
    hash = (hash * 16777619) & 0xffffffff
  end
  return hash
end

  //
function util.isTimeInRange(time, range)
  if range[1] < range[2] then
    return time >= range[1] and time <= range[2]
  else
    return time >= range[1] or time <= range[2]
  end
end

  //
// get the firing angle to hit a target offset with a ballistic projectile
function util.aimVector(targetVector, v, gravityMultiplier, useHighArc)
  local x = targetVector[1]
  local y = targetVector[2]
  local g = gravityMultiplier * world.gravity(mcontroller.position())
  local reverseGravity = false
  if g < 0 then
    reverseGravity = true
    g = -g
    y = -y
  end

  local term1 = v^4 - (g * ((g * x * x) + (2 * y * v * v)))

  if term1 >= 0 then
    local term2 = math.sqrt(term1)
    local divisor = g * x
    local aimAngle = 0

    if divisor ~= 0 then
      if useHighArc then
        aimAngle = math.atan(v * v + term2, divisor)
      else
        aimAngle = math.atan(v * v - term2, divisor)
      end
    end

    if reverseGravity then
      aimAngle = -aimAngle
    end

    return {v * math.cos(aimAngle), v * math.sin(aimAngle)}, true
  else
    // if out of range, normalize to 45 degree angle
    return {(targetVector[1] > 0 and v or -v) * math.cos(math.pi / 4), v * math.sin(math.pi / 4)}, false
  end
end

function util.predictedPosition(target, source, targetVelocity, projectileSpeed)
  local targetVector = world.distance(target, source)
  local bs = projectileSpeed
  local dotVectorVel = vec2.dot(targetVector, targetVelocity)
  local vector2 = vec2.dot(targetVector, targetVector)
  local vel2 = vec2.dot(targetVelocity, targetVelocity)

  //If the answer is a complex number, for the love of god don't continue
  if ((2*dotVectorVel) * (2*dotVectorVel)) - (4 * (vel2 - bs * bs) * vector2) < 0 then
    return target
  end

  local timesToHit = {} //Gets two values from solving quadratic equation
  //Quadratic formula up in dis
  timesToHit[1] = (-2 * dotVectorVel + math.sqrt((2*dotVectorVel) * (2*dotVectorVel) - 4*(vel2 - bs * bs) * vector2)) / (2 * (vel2 - bs * bs))
  timesToHit[2] = (-2 * dotVectorVel - math.sqrt((2*dotVectorVel) * (2*dotVectorVel) - 4*(vel2 - bs * bs) * vector2)) / (2 * (vel2 - bs * bs))

  //Find the nearest lowest positive solution
  local timeToHit = 0
  if timesToHit[1] > 0 and (timesToHit[1] <= timesToHit[2] or timesToHit[2] < 0) then timeToHit = timesToHit[1] end
  if timesToHit[2] > 0 and (timesToHit[2] <= timesToHit[1] or timesToHit[1] < 0) then timeToHit = timesToHit[2] end

  local predictedPos = vec2.add(target, vec2.mul(targetVelocity, timeToHit))
  return predictedPos
end

function util.randomChoice(options)
  return options[math.random(#options)]
end

function util.weightedRandom(options, seed)
  if seed then
    math.randomseed(seed)
  end

  local totalWeight = 0
  for _,pair in ipairs(options) do
    totalWeight = totalWeight + pair[1]
  end

  local choice = math.random() * totalWeight
  for _,pair in ipairs(options) do
    choice = choice - pair[1]
    if choice < 0 then
      return pair[2]
    end
  end
  return nil
end

function generateSeed()
  return sb.makeRandomSource():randu64()
end

function applyDefaults(args, defaults)
  for k,v in pairs(args) do
    defaults[k] = v
  end
  return defaults
end

function extend(base)
  return {
    __index = base
  }
end

  //
function util.absolutePath(directory, path)
  if string.sub(path, 1, 1) == "/" then
    return path
  else
    return directory..path
  end
end

function util.pathDirectory(path)
  local parts = util.split(path, "/")
  local directory = "/"
  for i=1, #parts-1 do
    if parts[i] ~= "" then
      directory = directory..parts[i].."/"
    end
  end
  return directory
end

function util.split(str, sep)
  local parts = {}
  repeat
    local s, e = string.find(str, sep, 1, true)
    if s == nil then break end

    table.insert(parts, string.sub(str, 1, s-1))
    str = string.sub(str, e+1)
  until string.find(str, sep, 1, true) == nil
  table.insert(parts, str)
  return parts
end

  //
// TODO: distinguish between arrays and objects to match JSON merging behavior
function util.mergeTable(t1, t2)
  for k, v in pairs(t2) do
    if type(v) == "table" and type(t1[k]) == "table" then
      util.mergeTable(t1[k] or {}, v)
    else
      t1[k] = v
    end
  end
  return t1
end

  //
function util.toRadians(degrees)
  return (degrees / 180) * math.pi
end


function util.sum(values)
  local sum = 0
  for _,v in pairs(values) do
    sum = sum + v
  end
  return sum
end
  //
function util.easeInOutQuad(ratio, initial, delta)
  ratio = ratio * 2
  if ratio < 1 then
    return delta / 2 * ratio^2 + initial
  else
    return -delta / 2 * ((ratio - 1) * (ratio - 3) - 1) + initial
  end
end

function util.easeInOutSin(ratio, initial, delta)
  local ratio = ratio * 2
  if ratio < 1 then
    return initial + (math.sin((ratio * math.pi / 2) - (math.pi / 2)) + 1.0) * delta / 2
  else
    sb.logInfo("%s", math.sin((ratio - 1) * math.pi / 2))
    return initial + (delta / 2) + (math.sin((ratio - 1) * math.pi / 2) * delta / 2)
  end
end

function util.easeInOutExp(ratio, initial, delta, exp)
  ratio = ratio * 2
  if ratio < 1 then
    return delta / 2 * (ratio ^ exp) + initial
  else
    local r = 1 - (1 - (ratio - 1)) ^ exp
    return initial + (delta / 2) + (r * delta / 2)
  end
end

function util.lerp(ratio, a, b)
  if type(a) == "table" then
    a, b = a[1], a[2]
  end

  return a + (b - a) * ratio
end

function util.interpolateHalfSigmoid(offset, value1, value2)
  local sigmoidFactor = (util.sigmoid(6 * offset) - 0.5) * 2
  return util.lerp(sigmoidFactor, value1, value2)
end

function util.interpolateSigmoid(offset, value1, value2)
  local sigmoidFactor = util.sigmoid(12 * (offset - 0.5))
  return util.lerp(sigmoidFactor, value1, value2)
end

function util.sigmoid(value)
  return 1 / (1 + math.exp(-value));
end

// Debug functions
function util.setDebug(debug)
  self.debug = debug
end
function util.debugPoint(...) return self.debug and world.debugPoint(...) end
function util.debugLine(...) return self.debug and world.debugLine(...) end
function util.debugText(...) return self.debug and world.debugText(...) end
function util.debugLog(...) return self.debug and sb.logInfo(...) end
function util.debugRect(rect, color)
  if self.debug then
    world.debugLine({rect[1], rect[2]}, {rect[3], rect[2]}, color)
    world.debugLine({rect[3], rect[2]}, {rect[3], rect[4]}, color)
    world.debugLine({rect[3], rect[4]}, {rect[1], rect[4]}, color)
    world.debugLine({rect[1], rect[4]}, {rect[1], rect[2]}, color)
  end
end
function util.debugPoly(poly, color)
  if self.debug then
    local current = poly[1]
    for i = 2, #poly do
      world.debugLine(current, poly[i], color)
      current = poly[i]
    end
    world.debugLine(current, poly[1], color)
  end
end
function util.debugCircle(center, radius, color, sections)
  if self.debug then
    sections = sections or 20
    for i = 1, sections do
      local startAngle = math.pi * 2 / sections * (i-1)
      local endAngle = math.pi * 2 / sections * i
      local startLine = vec2.add(center, {radius * math.cos(startAngle), radius * math.sin(startAngle)})
      local endLine = vec2.add(center, {radius * math.cos(endAngle), radius * math.sin(endAngle)})
      world.debugLine(startLine, endLine, color)
    end
  end
end

// Config and randomization helpers
function util.randomInRange(numberRange)
  if type(numberRange) == "table" then
    return numberRange[1] + (math.random() * (numberRange[2] - numberRange[1]))
  else
    return numberRange
  end
end

function util.randomIntInRange(numberRange)
  if type(numberRange) == "table" then
    return math.random(numberRange[1], numberRange[2])
  else
    return numberRange
  end
end

function util.randomFromList(list, randomSource)
  if type(list) == "table" then
    if randomSource then
      return list[randomSource:randInt(1, #list)]
    else
      return list[math.random(1,#list)]
    end
  else
    return list
  end
end

function util.mergeLists(first, second)
  local merged = copy(first)
  for _,item in pairs(second) do
    table.insert(merged, item)
  end
  return merged
end

function util.appendLists(first, second)
  for _,item in ipairs(second) do
    table.insert(first, item)
  end
end

function util.tableKeys(tbl)
  local keys = {}
  for key,_ in pairs(tbl) do
    keys[#keys+1] = key
  end
  return keys
end

function util.tableValues(tbl)
  local values = {}
  for _,value in pairs(tbl) do
    values[#values+1] = value
  end
  return values
end

function util.tableSize(tbl)
  local size = 0
  for _,_ in pairs(tbl) do
    size = size + 1
  end
  return size
end

function util.tableWrap(tbl, i)
  return tbl[util.wrap(i, 1, #tbl)]
end

function util.tableToString(tbl)
  local contents = {}
  for k,v in pairs(tbl) do
    local kstr = tostring(k)
    local vstr = tostring(v)
    if type(v) == "table" and (not getmetatable(v) or not getmetatable(v).__tostring) then
      vstr = util.tableToString(v)
    end
    contents[#contents+1] = kstr.." = "..vstr
  end
  return "{ " .. table.concat(contents, ", ") .. " }"
end

function util.stringTags(str)
  local tags = {}
  local tagStart, tagEnd = str:find("<.->")
  while tagStart do
    table.insert(tags, str:sub(tagStart+1, tagEnd-1))
    tagStart, tagEnd = str:find("<.->", tagEnd+1)
  end
  return tags
end

function util.replaceTag(data, tagName, tagValue)
  local tagString = "<"..tagName..">"
  if type(data) == "table" then
    local newData = {}

    for k, v in pairs(data) do
      local newKey = k
      if type(k) == "string" and k:find(tagString) then
        newKey = k:gsub(tagString, tagValue)
      end

      newData[newKey] = util.replaceTag(v, tagName, tagValue)
    end

    return newData
  elseif type(data) == "string" and data:find(tagString) then
    return data:gsub(tagString, tagValue)
  else
    return data
  end
end

function util.seedTime()
  return math.floor((os.time() + (os.clock() % 1)) * 1000)
end

function util.wrapFunction(fun, wrapper)
  return function (...)
    return wrapper(fun, ...)
  end
end
  */
}

//TABLE HELPERS

/**
 * Deep recursive copy of an array or an object. Should be rather slow. Use sparingly with complex types.
 * @param variable If not an object, returns value
 */
declare function copy(variable: any):any;

/**
 * Deep recursive compare of two variables. Should be rather slow. Use sparingly with complex types.
 * @param table1 
 * @param table2 
 */
declare function compare(table1: any,table2: any):boolean;

/**
 * Checks if an array includes a value using Deep Compare (by all properties, not by reference). Use sparingly with complex types.
 * @param table 
 * @param value1
 * @returns index of the element or false if not found
 */
declare function contains(table: any[], value1: any):number|false;

/**
 * FIXME
 * @param table
 * @param args 
 */
declare function construct(table: any[], ...args):void;

//FIXME
declare function path(table: any[], ...args):unknown|null;

//FIXME
declare function jsonPath(table: any[], pathString: string):unknown;

//FIXME
declare function setPath(t, ...args):void;

//FIXME
declare function jsonSetPath(t, pathString, value):void

/**
 * Fisher-Yates shuffle. Mutates a table by randomply shuffling elements.
 * @param list 
 */
declare function shuffle(list: any[]|{[key: string]: any}):void

//Returns shallow copy of a table
declare function shallowCopy(list: any[]):any[];
declare function shallowCopy(list: {[key: string]: any}):{[key: string]: any};

//Returns a shallow copy of the reshuffled table
declare function shuffled(list: any[]):any[];
declare function shuffled(list: {[key: string]: any}):{[key: string]: any};

//Returns if a table is empty
declare function isEmpty(tbl: any[]|{[key: string]: any}):boolean;

//Logical xor
declare function xor(a,b):boolean;

//FIXME
declare function bind(func: Function, ...args):unknown;

/*
// The very most basic state machine
// Allows setting a single coroutine as an active state
FSM = {}
function FSM:new()
local instance = {}
setmetatable(instance, { __index = self })
return instance
end

function FSM:set(state, ...)
if state == nil then
self.state = nil
return
end
self.state = coroutine.create(state)
self:resume(...)
end

function FSM:resume(...)
local s, r = coroutine.resume(self.state, ...)
if not s then error(r) end
return r
end

function FSM:update(dt)
if self.state then
return self:resume()
end
end
*/

// Very basic and probably not that reliable profiler
/** @customConstructor Profiler.new */
declare class Profiler {
  totals: {[key: string]: number};
  timers: {[key: string]: number}; //each timer value is a timestamp of when a timer started
  ticks: number; //Default: 0

  constructor();
  new();
  //adds timestamp with a <key> name
  start(key: string):void;
  //records run time for <key> in totals and stops that timer
  stop(key: string):void;
  //simply increases ticks by 1
  tick():void;
  /**
   * Dumps recorded data in Sb console in the format of [key]: seconds
   */
  dump():void;
}

/*
// ControlMap
// Simple helper for activating named values and clearing them
// I.e damage sources, physics regions etc
ControlMap = {}
function ControlMap:new(controlValues)
local instance = {
controlValues = controlValues,
activeValues = {}
}
setmetatable(instance, { __index = self })
return instance
end

function ControlMap:contains(name)
return self.controlValues[name] ~= nil
end

function ControlMap:clear()
self.activeValues = {}
end

function ControlMap:setActive(name)
self.activeValues[name] = copy(self.controlValues[name])
end

function ControlMap:add(value)
table.insert(self.activeValues, value)
end

function ControlMap:values()
return util.toList(self.activeValues)
end
*/