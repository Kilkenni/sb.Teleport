--@diagnostic disable: undefined-global

require("/interface/mel_tp/mel_tp_util.lua")

local mel_tp = {
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
mel_tp.configPath = metagui.inputData.configPath
mel_tp.configOverride = root.assetJson(mel_tp.configPath)

-- sb.logInfo(metagui.inputData.configPath);

 -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}
local function displayPlanetInfo(coord)
  local dbErrorText = mel_tp.dialogConfig.mel_tp_dialog.CelestialDatabaseError or ""
  local name = celestial.planetName(coord)
  local planetParams = celestial.visitableParameters(coord)
  if name ~= nil then
    lblBkmName:setText(name)
  else
    lblBkmName:setText(dbErrorText)
  end
  if planetParams ~= nil then
    lblBkmHazards:setText("Hazards: " .. sb.printJson(planetParams.environmentStatusEffects))
    if #planetParams.environmentStatusEffects > 0 then
      local hazardTemplate = listHazards.data
      -- sb.logInfo(sb.printJson(hazardTemplate))

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
  listHazards:clearChildren()

  if(type(mel_tp.selected.warpAction) == "string") then
    if mel_tp.selected.warpAction ~= "OrbitedWorld" then
      lblBkmName:setText("Special system alias signature " .. sb.printJson(mel_tp.selected.warpAction))
      lblBkmHazards:setText(world.timeOfDay())
    else
      local shipLocation = celestial.shipLocation()
      local locationType = mel_tp_util.getSpaceLocationType(shipLocation)
      if shipLocation == nil or locationType ~= "CelestialCoordinate" then
        if shipLocation == nil then
            sb.logError("Teleport list contains [Orbited World] but ship location is NIL}")
        else
            sb.logError("Teleport list contains [Orbited World] but ship location is " .. sb.printJson(shipLocation))
        end
        return
      end
      local coord = shipLocation[2]
      displayPlanetInfo(coord)
    end
  elseif(mel_tp.selected.warpAction[1] == "player" )then
    lblBkmName:setText("Player signature")
    lblBkmHazards:setText(world.timeOfDay())
  elseif mel_tp.selected.warpAction[1] == "object" then
    lblBkmName:setText("Object Uuid signature")
    lblBkmHazards:setText(world.timeOfDay())
  else
    -- sb.logInfo("[log] Showing info for: "..sb.printJson(mel_tp.selected.warpAction[1]))
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
          goto continue
        end
      end

      if (destination.warpAction == "OrbitedWorld") then
        --allow warp only if CelestialCoordinate
        local shipLocation = celestial.shipLocation()
        local locationType = mel_tp_util.getSpaceLocationType(shipLocation)
        
        --debug
        --[[
        sb.logInfo("Location type is "..sb.printJson(locationType))
        lblDump:setText(sb.printJson(shipLocation) or sb.print(shipLocation))

        if(shipLocation[1] == "coordinate") then
          lblDebug:setText(sb.printJson(celestial.planetName(shipLocation[2])))
          --debug
          sb.logInfo("Location is"..sb.printJson(shipLocation))
        end
        --]]

        --[[
        if(type(shipLocation) ~= "table" or type(shipLocation[1])== "number" or (shipLocation[2].planet and type(shipLocation[2].planet) ~= "number")) then
          return; 
        end 
        --]]

        if locationType == nil or  locationType ~= "CelestialCoordinate" then
          goto continue --Warping down is available only when orbiting a planet
        end
        if player:worldId() ~= player:ownShipWorldId() then
          goto continue --Disable when player is not on THEIR ship
      end
      end

      if destination.warpAction == "OwnShip" and player.worldId() == player.ownShipWorldId() then
        goto continue --If a player is already on their ship, do not offer to warp there even if config lists it
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
      ::continue::
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
    
        -- { "type": "listItem", "id" : "tpBookmark", "children": [
        --   { "type": "image", "id":"tpIcon", "file": ""},
        --   {"type":"label", "id":"tpName", "text": "name"},
        --   {"type": "label", "id":"tpPlanetName", "text": "planet"}
        --   ],
        --   "data": {"target": null}
        -- }

    
        currentBookmark.id = currentBookmark.id .. index
        -- tpName:setText(sb.printJson(mel_tp.data[1].bookmarkName))
        -- tpPlanetName:setText(mel_tp.data[1].targetName)
        -- tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.data[1].icon..".png")
        
        currentBookmark.children[1].id = currentBookmark.children[1].id .. index
        currentBookmark.children[2].id = currentBookmark.children[2].id .. index
        currentBookmark.children[3].id = currentBookmark.children[3].id .. index
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
  chat.send(sb.printJson(txtboxFilter.text))
end

function txtboxFilter:onEscape()
  btnResetFilter:onClick()
end

function btnResetFilter:onClick()
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

--[[
function btnSortByPlanet:onClick()
  table.sort(mel_tp.data, function(el1, el2) return el1.targetName:upper() < el2.targetName:upper() end)
  populateBookmarks()
end
--]]

function btnTeleport:onClick()
  if(mel_tp.selected == nil) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  local warpTarget = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
  --[[
  if(type(warpTarget) ~= "string") then
    warpTarget = mel_tp.selected.warpAction[1]..tostring(mel_tp.selected.warpAction[2] and "=" .. tostring(mel_tp.selected.warpAction[2]) or "")
  end
  --]]
  
  lblDump:setText("Stringified warp target: " .. warpTarget)
  widget.playSound("/sfx/interface/ship_confirm1.ogg")
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy or false)
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