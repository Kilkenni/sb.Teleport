--- -@diagnostic disable: undefined-global
-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"
require("/interface/mel_tp/mel_tp_util.lua")

local mel_tp = {
  bookmarks = nil,
  bookmarkTemplate = bookmarksList.data,
  configOverride = nil,
  selected = nil,
  animation = "default"
}
mel_tp.bookmarks = player.teleportBookmarks()
mel_tp.bookmarkTemplate = bookmarksList.data
mel_tp.configOverride = metagui.inputData

 -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

local function OnTpTargetSelect(bookmarkWidget)
  mel_tp.selected = bookmarkWidget.bkmData
  
  if(type(mel_tp.selected.warpAction) == "string") then
    lblBkmName:setText("");
    lblBkmHazards:setText("Special system alias signature");
  elseif(mel_tp.selected.warpAction[1] == "player" )then
      lblBkmName:setText("")
      lblBkmLocType:setText("Player signature")
  elseif (mel_tp.selected.warpAction[1] == "object") then
      lblBkmName:setText("")
      lblBkmLocType:setText("Object Uuid signature")
  else
    sb.logInfo("[log] Showing info for: "..sb.printJson(mel_tp.selected.warpAction[1]))
    local warpTarget = mel_tp.selected.warpAction[1];
    local coord = WorldIdToObject(warpTarget)
    if(coord == nil) then
      lblBkmName:setText("Database Error");
      lblBkmHazards:setText(world.timeOfDay());
    else
      if coord.location ~= nil then
        -- CelestialCoordinate
        local name = celestial.planetName(coord)
        local planetParams = celestial.visitableParameters(coord)
        if name ~= nil then
          lblBkmName:setText(name)
        else
          lblBkmName:setText("Database Error");
        end
        if planetParams ~= nil then
            lblBkmLocType:setText(planetParams.typeName)
        else
          lblBkmHazards:setText(world.timeOfDay());
        end
        if(planetParams ~= nil) then
          lblBkmHazards:setText("Hazards: "..sb.printJson(planetParams.environmentStatusEffects));
        end
        sb:logInfo("[log] Planet visitable parameters: "..sb:printJson(planetParams))
      else
        --InstanceWorld
        local instanceId = coord
        if instanceId.instance ~= nil then
            lblBkmName:setText(instanceId.instance)
        end
        if instanceId.level ~= "-" then
            lblBkmLocType:setText("Level ${instanceId.level}")
        end
      end
    end
  end
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

  if finalTpConfig.includePlayerBookmarks and mel_tp.bookmarks ~= nil then
    for index, bookmark in ipairs(mel_tp.bookmarks) do
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

  if finalTpConfig.destinations ~= nil then
    for index, dest in ipairs(finalTpConfig.destinations) do
      local destination = JsonToDestination(nil, dest)

      if destination.prerequisiteQuest and player:hasCompletedQuest(destination.prerequisiteQuest) == false then
        return
      end

      if (destination.warpAction == "OrbitedWorld") then
        --allow warp only if CelestialCoordinate
        local shipLocation = celestial.shipLocation()
        local locationType = getSpaceLocationType(shipLocation)
        --debug
        lblDump:setText(sb.printJson(shipLocation) or sb.print(shipLocation))
        if(shipLocation[1] == "coordinate") then
          lblDebug:setText(sb.printJson(celestial.planetName(shipLocation[2])))
          sb.logInfo("Location is"..sb.printJson(shipLocation[2]))
          sb.logInfo("Planet size is "..sb.printJson(celestial.planetSize(shipLocation[2])))
          sb.logInfo("Planet name is"..sb.printJson(celestial.planetName(shipLocation[2])))
        end
        --[[
        if(type(shipLocation) ~= "table" or type(shipLocation[1])== "number" or (shipLocation[2].planet and type(shipLocation[2].planet) ~= "number")) then
          return; 
        end 
        --]]

        if tostring(locationType) ~= "CelestialCoordinate" then
          return; --Warping down is available only when orbiting a planet
        end
      end

      if destination.warpAction == "OwnShip" and player.worldId() == player.ownShipWorldId() then
        return --If a player is already on their ship, do not offer to warp there even if config lists it
      end
      
      local currentBookmark = mel_tp.bookmarkTemplate
      local iconPath = ""
      if destination.icon ~= nil then
          iconPath = ("/interface/bookmarks/icons/" .. destination.icon) .. ".png"
      end

      --Special: for mission teleports when in a party
      if destination.mission == true and type(destination.warpAction) ~= "string" then
        local warpAction = destination.warpAction
        if (string.find(warpAction[1], "InstanceWorld") ~= nil) then
          local teamUuid = "" --TODO FIX
          destination.warpAction = {warpAction[1], teamUuid}
        end
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
      if bkmData.prerequisiteQuest and player.hasCompletedQuest(bkmData.prerequisiteQuest) == false then
        return
      end

      currentBookmark.children[1].file = bkmData.icon
      currentBookmark.children[2].text = bkmData.name
      currentBookmark.children[3].text = bkmData.planetName
      local addedBookmark = bookmarksList:addChild(currentBookmark)
      addedBookmark.onSelected = OnTpTargetSelect
      addedBookmark.bkmData = bkmData
    end
  end

  metagui.queueFrameRedraw()
end

--[[  FIX THIS
if mel_tp.bookmarks ~= nil then
  mel_tp.bookmarks = sortArrayByProperty(nil, mel_tp.bookmarks, "bookmarkName", false)
end
--]]
populateBookmarks()

function btnDumpTp:onClick()
  --lblDebug:setText(sb.printJson(mel_tp.bookmarks))
  local shipLocation = celestial.shipLocation();
  if(shipLocation[1] == "coordinate") then
    if(type(shipLocation[2]) == "string") then
      lblBkmName:setText("");
      lblBkmHazards:setText("Entity signature");
    else
      sb.logInfo("[log] ship location "..sb.printJson(shipLocation[2]))
      local warpTarget = shipLocation[2];
      local coord = WorldIdToCelestialCoordinate(warpTarget)
      if(coord == nil) then
        lblBkmName:setText("Database Error");
        lblBkmHazards:setText(world.timeOfDay());
      else
        local name = celestial.planetName(coord);
        local planetParams = celestial.visitableParameters(coord);
        if(name ~= nil) then
          lblBkmName:setText(name); 
        end
        if(planetParams ~= nil) then
          lblBkmHazards:setText("Hazards: "..sb.printJson(planetParams.environmentStatusEffects));
          local config = root.assetJson("/interface/mel_tp/mel_tp.config");
          -- sb.logInfo(sb.printJson(config.planetaryEnvironmentHazards))
          -- listHazards:clearChildren();
          for index, effect in ipairs(planetParams.environmentStatusEffects) do
            local iconPath = config.planetaryEnvironmentHazards[effect] or config.planetaryEnvironmentHazards.error;
            local newEffect = {
              type =  "image",
              file = iconPath,
              tooltip = "Effect!",
              scale = 2,
              noAutoCrop = true,
            }
            listHazards:addChild(newEffect);
          end
        end
        --debug line
        --sb.logInfo(sb.printJson(planetParams));
      end
    end
    -- lblDebug:setText(sb.printJson(celestial.planetName(shipLocation[2]))..world.timeOfDay())
    -- sb.logInfo("Location is "..sb.printJson(shipLocation[2]))
    -- sb.logInfo("Planet size is "..sb.printJson(celestial.planetSize(shipLocation[2])))
    -- sb.logInfo("Planet name is "..sb.printJson(celestial.planetName(shipLocation[2])))
  end
end

function btnSortByPlanet:onClick()
  table.sort(mel_tp.data, function(el1, el2) return el1.targetName:upper() < el2.targetName:upper() end)
  populateBookmarks()
end

function btnTeleport:onClick()
  if(mel_tp.selected == nil) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  local warpTarget = TargetToWarpCommand(mel_tp.selected.warpAction)
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