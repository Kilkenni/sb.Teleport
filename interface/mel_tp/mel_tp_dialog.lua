---@diagnostic disable: undefined-global

require("/interface/mel_tp/mel_tp_util.lua")

local mel_tp = {
  paneIcon = "/interface/warping/icon.png",
  paneTitle = "Teleporter",
  bookmarks = nil,
  filter = "",
  bookmarksFiltered = nil,
  bookmarkTemplate = bookmarksList.data,
  configPath = "",
  configOverride = nil,
  selected = nil,
  animation = "default",
  dialogConfig = root.assetJson("/interface/mel_tp/mel_tp.config"),
  version = "SparkTpTec v: unknown",
  sorting = {
    byPlanetAsc = false,
    byNameAsc = true
  }
}
local inactiveColor = "ff0000"

local function getCurrentLocation()
  local entityConfig = root.itemConfig({
    name = world.getObjectParameter(
      pane.sourceEntity(),
      "objectName"
    ),
    count = 1,
    parameters = {}
  })
  local uniqueId = ""
  if entityConfig ~= nil then
    uniqueId = world.entityUniqueId(pane.sourceEntity())
  end
  if uniqueId ~= "" then
    local worldId = player.worldId()
    return {worldId, uniqueId}
  end
  return nil
end

local function clearPlanetInfo()
  lblBkmName:setText("")
  lblBkmHazards:setText("")
  listHazards:clearChildren()
end

local function displayPlanetInfo(coord, currentLocation)
  clearPlanetInfo()
  local dbErrorText = mel_tp.dialogConfig.mel_tp_dialog.CelestialDatabaseError or ""
  local name = celestial.planetName(coord)
  local planetParams = celestial.visitableParameters(coord)
  if currentLocation == true then
    lblBkmNote.setText("Your current location")
  end
  if name ~= nil then
    lblBkmName:setText(name)
  else
    lblBkmName:setText(dbErrorText)
  end
  if planetParams ~= nil then
    --debug
    -- lblBkmHazards:setText("Hazards: " .. sb.printJson(planetParams.environmentStatusEffects))
    if #planetParams.environmentStatusEffects > 0 then
      local hazardTemplate = listHazards.data

      for index, effect in ipairs(planetParams.environmentStatusEffects) do
        if(mel_tp.dialogConfig.planetaryEnvironmentHazards[effect] ~= nil) then
          hazardTemplate.file = mel_tp.dialogConfig.planetaryEnvironmentHazards[effect].icon
          hazardTemplate.toolTip = mel_tp.dialogConfig.planetaryEnvironmentHazards[effect].displayName
        else
          hazardTemplate.file = mel_tp.dialogConfig.planetaryEnvironmentHazards.error.icon
          hazardTemplate.toolTip = mel_tp.dialogConfig.planetaryEnvironmentHazards.error.displayName
        end

        listHazards:addChild(hazardTemplate)
      end
    end
  else
    lblBkmHazards:setText(world.timeOfDay())
  end
end

local function OnTpTargetSelect(bookmarkWidget)
  mel_tp.selected = bookmarkWidget.bkmData
  local dbErrorText = mel_tp.dialogConfig.mel_tp_dialog.CelestialDatabaseError or ""
  clearPlanetInfo()
  btnEdit.color = inactiveColor;

  ---@diagnostic disable-next-line: undefined-field
  if(type(mel_tp.selected.warpAction) == "string") then
    ---@diagnostic disable-next-line: undefined-field
    if mel_tp.selected.warpAction ~= "OrbitedWorld" then
      ---@diagnostic disable-next-line: undefined-field
      lblBkmName:setText("Special system alias signature " .. sb.printJson(mel_tp.selected.warpAction))
      lblBkmHazards:setText(world.timeOfDay())
    else
      local shipLocation = celestial.shipLocation()
      local locationType = mel_tp_util.getSpaceLocationType(shipLocation)
      if locationType == nil or shipLocation == nil then
        sb.logError("Teleport list contains [Orbited World] but ship location is NIL}")
        return
      end

      if locationType ~= "CelestialCoordinate" then
        local systemLocations = celestial.systemObjects()
        local maybeUuid
        if locationType == "FloatingDungeon" then
          maybeUuid = shipLocation[2]
        end
        ---@diagnostic disable-next-line: undefined-field
        if maybeUuid == nil or mel_tp_util.TableContains(systemLocations, maybeUuid) == false or mel_tp.selected.deploy ~= true then
          sb.logError("Teleport list contains [Orbited World] but ship location is " .. sb.printJson(shipLocation))
          return
        end
      end
      local coord
      if locationType == "CelestialCoordinate" then
        coord = shipLocation[2]
      end
      displayPlanetInfo(coord)
    end
    ---@diagnostic disable-next-line: undefined-field
  elseif(mel_tp.selected.warpAction[1] == "player" )then
    lblBkmName:setText("Player signature")
    lblBkmHazards:setText(world.timeOfDay())
    ---@diagnostic disable-next-line: undefined-field
  elseif mel_tp.selected.warpAction[1] == "object" then
    lblBkmName:setText("Object Uuid signature")
    lblBkmHazards:setText(world.timeOfDay())
  else
    --Bookmark 
    ---@diagnostic disable-next-line: undefined-field
    local warpTarget = mel_tp.selected.warpAction[1]
    local coord = mel_tp_util.WorldIdToObject(warpTarget)
    if coord == nil then
      lblBkmName:setText(dbErrorText)
      lblBkmHazards:setText(world.timeOfDay())
    else
      if coord.location ~= nil then
        -- CelestialCoordinate
        displayPlanetInfo(coord)
      else
        --InstanceWorld
        local instanceId = coord
        if instanceId.instance ~= nil then
          lblBkmName:setText(instanceId.instance)
        end
        if instanceId.level ~= "-" then
          lblBkmHazards:setText("Level " .. tostring(instanceId.level))
        end
      end
    end
    btnEdit.color = "accent"
  end
  --debug
  lblDump:setText(sb.printJson(bookmarkWidget.bkmData))
end

local function refreshBookmarks()
  mel_tp.bookmarks = player.teleportBookmarks()
end

local function populateBookmarks()
  bookmarksList:clearChildren()
  local finalTpConfig = {
    canBookmark = false,
    bookmarkName = "",
    canTeleport = true,
    includePartyMembers = false,
    includePlayerBookmarks = false,
    destinations = nil
  }
  if mel_tp.configOverride ~= nil then        
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.canBookmark = mel_tp.configOverride.canBookmark or finalTpConfig.canBookmark
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.bookmarkName = mel_tp.configOverride.bookmarkName or finalTpConfig.bookmarkName
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.canTeleport = mel_tp.configOverride.canTeleport or finalTpConfig.canTeleport
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.includePartyMembers = mel_tp.configOverride.includePartyMembers or finalTpConfig.includePartyMembers
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.includePlayerBookmarks = mel_tp.configOverride.includePlayerBookmarks or finalTpConfig.includePlayerBookmarks
    ---@diagnostic disable-next-line: undefined-field
    finalTpConfig.destinations = mel_tp.configOverride.destinations or finalTpConfig.destinations
  end

  --Current location
  if finalTpConfig.canBookmark == true then
    local currentTpLocation = getCurrentLocation()
    if currentTpLocation ~= nil then
      local destination = {
        icon = "default",
        name = finalTpConfig.bookmarkName,
        planetName = "???",
        warpAction = currentTpLocation
      }
      if mel_tp_util.IsBookmarkShip(destination.warpAction) then
        destination.icon = "ship"
        destination.planetName = "Player Ship"
      elseif mel_tp_util.IsBookmarkPlanet(destination.warpAction) then
        local planetWorldIdString = destination.warpAction[1]
        destination.icon = world.type() or "default"
        destination.planetName = celestial.planetName(mel_tp_util.WorldIdToObject(planetWorldIdString))
      elseif mel_tp_util.IsBookmarkInstance(destination.warpAction) then
        local instanceWorldIdString = destination.warpAction[1]
        local instanceWorldId = mel_tp_util.WorldIdToObject(instanceWorldIdString)
        destination.icon = world.type() or "default"
        if instanceWorldId ~= nil then
          --should always be true
          destination.planetName = instanceWorldId.instance
        end
      end

      local currentLocBookmarked = util.find(
        mel_tp.bookmarks,
        function(bkm)
          return mel_tp_util.TargetToWarpCommand(bkm.target) == mel_tp_util.TargetToWarpCommand(destination.warpAction)
        end
      )

      if currentLocBookmarked == nil or finalTpConfig.canTeleport == false then
        local currentBookmark = mel_tp.bookmarkTemplate
        currentBookmark.children[1].file = mel_tp_util.getIconFullPath(destination.icon)
        if destination.name ~= "" then
          currentBookmark.children[2].text = destination.name .. " (not saved)"
        else
          currentBookmark.children[2].text = "Current location (not saved)"
        end
        currentBookmark.children[3].text = destination.planetName
        local addedBookmark = bookmarksList:addChild(currentBookmark)
        addedBookmark.onSelected = OnTpTargetSelect
        addedBookmark.bkmData = destination
        addedBookmark:select()
    end
    end
  end

  if finalTpConfig.destinations ~= nil then
    for index, dest in ipairs(finalTpConfig.destinations) do  
      local destination = mel_tp_util.JsonToDestination(dest)
      if(destination.prerequisiteQuest ~= nil) then
        if(player.hasCompletedQuest(destination.prerequisiteQuest) == false) then
          goto __continue4
        end
      end

      if (destination.warpAction == "OrbitedWorld") then
        if player:worldId() ~= player:ownShipWorldId() then
          goto __continue4 --Disable when player is not on THEIR ship
        end

        local shipLocation = celestial.shipLocation()
        local locationType = mel_tp_util.getSpaceLocationType(shipLocation)
        if locationType == nil then
          goto __continue4 --Warping down is unavailable when location is of unknown type
        end
        if locationType ~= "CelestialCoordinate" then
          local systemLocations = celestial.systemObjects();
          local maybeUuid = nil
          if(locationType == "FloatingDungeon") then
            maybeUuid = shipLocation[2]
          end
          
          -- sb.logWarn(sb.printJson(systemLocations))
          -- sb.logWarn(sb.print(maybeUuid))
          -- sb.logWarn(locationType)
          if(maybeUuid == nil or mel_tp_util.TableContains(systemLocations, maybeUuid) == false or destination.deploy ~= true) then
            --location is not FloatingDungeon OR current system locations have no such Uuid or no command to deploy mech
            
            goto __continue4 --Warping down is available only when orbiting a planet or floating dungeon
          end
        end
        
      end

      if destination.warpAction == "OwnShip" and player.worldId() == player.ownShipWorldId() then
        goto __continue4 --If a player is already on their ship, do not offer to warp there even if config lists it
      end
      
      local currentBookmark = mel_tp.bookmarkTemplate

      --Special: for mission teleports when in a party
      if destination.mission == true and type(destination.warpAction) ~= "string" then
        --if the warpAction is for an instance world, set the uuid to the team uuid -- or so the source code claims
        --we assume it is BookmarkTarget since Json configs can't teleport to dynamic objects or players, and it's not Alias
        local warpAction = destination.warpAction
        if (string.find(warpAction[1], "InstanceWorld") ~= nil) then
          local teamUuid = "" --TODO FIX
          destination.warpAction = {warpAction[1], teamUuid}
        end
      end

      if finalTpConfig.includePartyMembers == true then
        local beamPartyMember = mel_tp.dialogConfig.mel_tp_dialog.beamPartyMemberLabel
        local deployPartyMember = mel_tp.dialogConfig.mel_tp_dialog.deployPartyMemberLabel
        local beamPartyMemberIcon = mel_tp.dialogConfig.mel_tp_dialog.beamPartyMemberIcon
        local deployPartyMemberIcon = mel_tp.dialogConfig.mel_tp_dialog.deployPartyMemberIcon

        --add warp options for each party member

        --TODO find how to get party members
      end

      local bkmData = {
        warpAction = destination.warpAction,
        name = destination.name or "???",
        planetName = destination.planetName or "",
        icon = destination.icon,
        deploy = destination.deploy or false,
        mission = destination.mission or false,
        prerequisiteQuest = destination.prerequisiteQuest or false
      }

      currentBookmark.children[1].file = mel_tp_util.getIconFullPath(bkmData.icon)
      currentBookmark.children[2].text = bkmData.name
      currentBookmark.children[3].text = bkmData.planetName
      local addedBookmark = bookmarksList:addChild(currentBookmark)
      addedBookmark.onSelected = OnTpTargetSelect
      addedBookmark.bkmData = bkmData
      ::__continue4::
    end
  end

  -- player Bookmarks
  if finalTpConfig.includePlayerBookmarks then
    local filteredBookmarks
    if mel_tp.filter == "" then
      filteredBookmarks = mel_tp.bookmarks
    else
      filteredBookmarks = mel_tp.bookmarksFiltered
    end
    if filteredBookmarks ~= nil then
      for index, bookmark in ipairs(filteredBookmarks) do
        local currentBookmark = mel_tp.bookmarkTemplate
        local bkmData = {
            --system = false --for special locations like ship etc
            warpAction = bookmark.target,
            name = bookmark.bookmarkName or "???",
            planetName = bookmark.targetName or "",
            icon = bookmark.icon,
            deploy = false
        }
    
        -- { "type": "listItem", "children": [
        --   { "type": "image", "file": ""},
        --   {"type":"label", "text": "name"},
        --   {"type": "label", "text": "planet"}
        --   ],
        --   "data": {"target": null}
        -- }

    
        currentBookmark.children[1].file = mel_tp_util.getIconFullPath(bkmData.icon)
        currentBookmark.children[2].text = bkmData.name
        currentBookmark.children[3].text = bkmData.planetName
        -- currentBookmark.bkmData = bkmData
        local addedBookmark = bookmarksList:addChild(currentBookmark)
        addedBookmark.onSelected = OnTpTargetSelect
        addedBookmark.bkmData = bkmData
        ::__continue5::
      end
    end
  end

  metagui.queueFrameRedraw()
end

--- Automatic function that gets called with dt interval by C++
-- 
-- @param dt Frequency of refreshing, in delta tick. 1 dt = 1/60 of a second
function update(dt)
  if player.getProperty("mel_tp_repopulate_required", false) == true then
    player.setProperty("mel_tp_repopulate_required", {})
    refreshBookmarks()
    if mel_tp.bookmarks ~= nil then
      mel_tp.bookmarksFiltered = mel_tp_util.FilterBookmarks(mel_tp.bookmarks, mel_tp.filter)
    end
    mel_tp.selected = nil
    populateBookmarks()
  end
end

txtboxFilter.onEnter = function(self)
  mel_tp.filter = txtboxFilter.text
  if mel_tp.bookmarks == nil then
    return
  end
  mel_tp.bookmarksFiltered = mel_tp_util.FilterBookmarks(mel_tp.bookmarks, mel_tp.filter)
  populateBookmarks()
end

txtboxFilter.onEscape = function(self)
  btnResetFilter:onClick()
end

btnResetFilter.onClick = function(self)
  mel_tp.filter = ""
  txtboxFilter:setText("")
  mel_tp.bookmarksFiltered = nil
  populateBookmarks()
end

btnSortByPlanet.onClick = function(self)
  if mel_tp.bookmarks == nil then
    return
  end
  mel_tp.sorting.byPlanetAsc = not mel_tp.sorting.byPlanetAsc
  mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "targetName", not mel_tp.sorting.byPlanetAsc)
  local label = "Sort by planet "
  if mel_tp.sorting.byPlanetAsc == true then
    label = label .. "˅"
  else
    label = label .. "˄"
  end
  btnSortByPlanet:setText(label)
  populateBookmarks()
end

btnEdit.onClick = function(self)
  ---@diagnostic disable-next-line: undefined-field
  if mel_tp.selected == nil or type(mel_tp.selected.warpAction) == "string" then
      widget.playSound("/sfx/interface/clickon_error.ogg")
      lblDump:setText("No target selected")
      return
  end
  player.interact("ScriptPane", {gui = {}, scripts = {"/metagui.lua"}, ui = "sbTeleport:TeleportEdit", data = {mel_tp = mel_tp, localeData = mel_tp.dialogConfig.mel_tp_edit}})
end

btnTeleport.onClick = function(self)
  if(mel_tp.selected == nil) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  ---@diagnostic disable-next-line: undefined-field
  local warpTarget = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
  if getCurrentLocation() ~= nil and warpTarget == mel_tp_util.TargetToWarpCommand(getCurrentLocation()) then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    lblDump:setText("You are already here")
    return
  end
  lblDump:setText("Stringified warp target: " .. warpTarget)
  
  ---@diagnostic disable-next-line: undefined-field
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy or false)
  pane.dismiss()
end

btnDeploy.onClick = function(self)
  if mel_tp.selected == nil then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    lblDump:setText("No target selected")
    return
  end
  if player.canDeploy() == false then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    lblDump:setText("No mech to deploy")
    return
  end
  
---@diagnostic disable-next-line: undefined-field
  local warpTarget = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
  if getCurrentLocation() ~= nil and warpTarget == mel_tp_util.TargetToWarpCommand(getCurrentLocation()) then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    lblDump:setText("You are already here")
    return
  end
  player.warp(warpTarget, "deploy", true)
  pane.dismiss()
end

btnFallback.onClick = function(self)
  player.interact("OpenTeleportDialog", mel_tp.configPath, pane.sourceEntity());
  pane.dismiss();
end

local function main()
  local sourceEntity = pane.sourceEntity()
  if world.getObjectParameter(sourceEntity, "objectName") ~= nil 
  then
    local entityConfig = root.itemConfig({
      name = world.getObjectParameter(sourceEntity, "objectName"),
      count = 1,
      parameters = {}
    })
    if entityConfig ~= nil then
      local iconName = world.getObjectParameter(sourceEntity, "inventoryIcon")
      mel_tp.paneIcon = entityConfig.directory..iconName
    end
    mel_tp.paneTitle = world.getObjectParameter(sourceEntity, "shortdescription") or mel_tp.paneTitle
  end

  local metaguiTpData = metagui.inputData
  if metaguiTpData ~= nil then
      mel_tp.configPath = metaguiTpData.configPath or ""
      mel_tp.paneIcon = metaguiTpData.paneIcon or mel_tp.paneIcon
      mel_tp.paneTitle = metaguiTpData.paneTitle or mel_tp.paneTitle
  end
  if mel_tp.configPath ~= nil then
      mel_tp.configOverride = root.assetJson(mel_tp.configPath)
  end

  --pane init
  if player.canDeploy() == false then
    btnDeploy.color = inactiveColor
  end
  btnEdit.color = inactiveColor

  metagui.setTitle(mel_tp.paneTitle);
  metagui.setIcon(mel_tp.paneIcon);

  if mel_tp.bookmarks ~= nil then
    mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "bookmarkName", not mel_tp.sorting.byNameAsc)
  end
  refreshBookmarks()
  populateBookmarks()

  -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

    --for OpenSb only
  if root.assetSourcePaths ~= nil then
    local assetsWithMetadata = root.assetSourcePaths(true)
    for modPath in pairs(assetsWithMetadata) do
        local modName = "sb.Teleport"
        if assetsWithMetadata[modPath].name == modName then
            mel_tp.version = "SparkTpTec v: " .. tostring(assetsWithMetadata[modPath].version)
        end
    end
  end
  lblVersion:setText(mel_tp.version)

  local currentLoc = getCurrentLocation()
    if currentLoc ~= nil then
      local currentLocBookmarked = util.find(
        mel_tp.bookmarks,
        function(bkm)
          return mel_tp_util.TargetToWarpCommand(bkm.target) == mel_tp_util.TargetToWarpCommand(currentLoc)
        end
      )
      if currentLocBookmarked == nil and mel_tp.selected ~= nil then
        btnEdit:onClick()
      end
  end
end

main()