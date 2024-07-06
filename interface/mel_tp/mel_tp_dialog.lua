--@diagnostic disable: undefined-global

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
  dialogConfig = root.assetJson("/interface/mel_tp/mel_tp.config")
}
mel_tp.bookmarks = player.teleportBookmarks()
mel_tp.bookmarkTemplate = bookmarksList.data
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

local inactiveColor = "ff0000"
if player.canDeploy() == false then
    btnDeploy.color = inactiveColor
end
btnEdit.color = inactiveColor

metagui.setTitle(mel_tp.paneTitle);
metagui.setIcon(mel_tp.paneIcon);

 -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

local function clearPlanetInfo()
  lblBkmName:setText("")
  lblBkmHazards:setText("")
  listHazards:clearChildren()
end

local function displayPlanetInfo(coord)
  clearPlanetInfo()
  local dbErrorText = mel_tp.dialogConfig.mel_tp_dialog.CelestialDatabaseError or ""
  local name = celestial.planetName(coord)
  local planetParams = celestial.visitableParameters(coord)
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

  if(type(mel_tp.selected.warpAction) == "string") then
    if mel_tp.selected.warpAction ~= "OrbitedWorld" then
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
  elseif(mel_tp.selected.warpAction[1] == "player" )then
    lblBkmName:setText("Player signature")
    lblBkmHazards:setText(world.timeOfDay())
  elseif mel_tp.selected.warpAction[1] == "object" then
    lblBkmName:setText("Object Uuid signature")
    lblBkmHazards:setText(world.timeOfDay())
  else
    --Bookmark 
    btnEdit.color = "accent"

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

  end
  --debug
  lblDump:setText(sb.printJson(bookmarkWidget.bkmData))
end

local function populateBookmarks()
  bookmarksList:clearChildren()
  local ____opt_0 = mel_tp.configOverride
  local ____temp_10 = ____opt_0 and ____opt_0.canBookmark or false
  local ____opt_2 = mel_tp.configOverride
  local ____temp_11 = ____opt_2 and ____opt_2.canTeleport or true
  local ____opt_4 = mel_tp.configOverride
  local ____temp_12 = ____opt_4 and ____opt_4.includePartyMembers or false
  local ____opt_6 = mel_tp.configOverride
  local ____temp_13 = ____opt_6 and ____opt_6.includePlayerBookmarks or false
  local ____opt_8 = mel_tp.configOverride
  local finalTpConfig = {
    canBookmark = ____temp_10,
    canTeleport = ____temp_11,
    includePartyMembers = ____temp_12,
    includePlayerBookmarks = ____temp_13,
    destinations = ____opt_8 and ____opt_8.destinations or nil
  }

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
            --location is not FLoatingDungeon OR current system locations have no such Uuid or no command to deploy mech
            sb.logWarn(sb.printJson(shipLocation))
            sb.logWarn(locationType)
            sb.logWarn(sb.print(maybeUuid))
            sb.logWarn(sb.printJson(systemLocations))
            sb.logWarn("Deploy mech? "..sb.print(deploy))
            
            goto __continue4 --Warping down is available only when orbiting a planet or floating dungeon
          end
        end
        
      end

      if destination.warpAction == "OwnShip" and player.worldId() == player.ownShipWorldId() then
        goto __continue4 --If a player is already on their ship, do not offer to warp there even if config lists it
      end
      
      local currentBookmark = mel_tp.bookmarkTemplate
      local iconPath = ""
      if destination.icon ~= nil then
          iconPath = ("/interface/bookmarks/icons/" .. destination.icon) .. ".png"
      end

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
        icon = iconPath,
        deploy = destination.deploy or false,
        mission = destination.mission or false,
        prerequisiteQuest = destination.prerequisiteQuest or false
      }

      currentBookmark.children[1].file = bkmData.icon
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
        local iconPath = ""
        if bookmark.icon ~= nil then
          iconPath = ("/interface/bookmarks/icons/" .. bookmark.icon) .. ".png"
        end
        local bkmData = {
            --system = false --for special locations like ship etc
            warpAction = bookmark.target,
            name = bookmark.bookmarkName or "???",
            planetName = bookmark.targetName or "",
            icon = iconPath,
            deploy = false
        }
    
        -- { "type": "listItem", "children": [
        --   { "type": "image", "file": ""},
        --   {"type":"label", "text": "name"},
        --   {"type": "label", "text": "planet"}
        --   ],
        --   "data": {"target": null}
        -- }

    
        currentBookmark.children[1].file = bkmData.icon
        currentBookmark.children[2].text = bkmData.name
        currentBookmark.children[3].text = bkmData.planetName
        -- currentBookmark.bkmData = bkmData
        local addedBookmark = bookmarksList:addChild(currentBookmark)
        addedBookmark.onSelected = OnTpTargetSelect
        addedBookmark.bkmData = bkmData
      end
    end
  end

  metagui.queueFrameRedraw()
end

function txtboxFilter:onEnter()
  mel_tp.filter = txtboxFilter.text
  if mel_tp.bookmarks == nil then
    return
  end
  mel_tp.bookmarksFiltered = mel_tp_util.FilterBookmarks(mel_tp.bookmarks, mel_tp.filter)
  populateBookmarks(nil)
end

function txtboxFilter:onEscape()
  btnResetFilter:onClick()
end

function btnResetFilter:onClick()
  mel_tp.filter = ""
  txtboxFilter:setText("")
  mel_tp.bookmarksFiltered = nil
  populateBookmarks()
end

function btnSortByPlanet:onClick()
  if mel_tp.bookmarks == nil then
    return
  end
  mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "targetName", false)
  populateBookmarks()
end

function btnEdit:onClick()
  if mel_tp.selected == nil or type(mel_tp.selected.warpAction) == "string" then
      widget.playSound("/sfx/interface/clickon_error.ogg")
      lblDump:setText("No target selected")
      return
  end
  widget.playSound("/sfx/interface/ship_confirm1.ogg")
end

function btnTeleport:onClick()
  if(mel_tp.selected == nil) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  local warpTarget = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
  lblDump:setText("Stringified warp target: " .. warpTarget)
  
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy or false)
  pane.dismiss()
end

function btnDeploy:onClick()
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
  
  local warpTarget = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
    player.warp(warpTarget, "deploy", true)
  pane.dismiss()
end

function btnFallback:onClick()
  player.interact("OpenTeleportDialog", mel_tp.configPath, pane.sourceEntity());
  pane.dismiss();
end

if mel_tp.bookmarks ~= nil then
  mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "bookmarkName", false)
end
populateBookmarks()