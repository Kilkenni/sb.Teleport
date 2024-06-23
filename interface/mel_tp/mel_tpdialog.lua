---@diagnostic disable: undefined-global
-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"

local mel_tp = {bookmarks = nil, bookmarkTemplate = bookmarksList.data, configOverride = nil, selected = nil}
mel_tp.bookmarks = player.teleportBookmarks()
mel_tp.bookmarkTemplate = bookmarksList.data
mel_tp.configOverride = metagui.inputData

 -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

function OnTpTargetSelect(bookmarkWidget)
  mel_tp.selected = bookmarkWidget.bkmData
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
    for index, destination in ipairs(finalTpConfig.destinations) do
      if(destination.warpAction == "OrbitedWorld") then
        local shipLocation = celestial.shipLocation(); --allow warp only if CelestialCoordinate
        lblDump:setText(sb.printJson(shipLocation) or sb.print(shipLocation))
        local locString
        if(type(shipLocation) == "table") then
          locString = shipLocation[2]
        end
        locString = 
        sb.logInfo(sb.printJson(celestial.planetSize(ShipLocation)))
        if(type(shipLocation) ~= "table" or type(shipLocation[1])== "number" or (shipLocation[2].planet and type(shipLocation[2].planet) ~= "number")) then
          --celestial.planetName(locString) == nil 
          return; --Warping down is available only when orbiting a planet
        end      
      end
      if(destination.warpAction == "OwnShip" and player.worldId() == player.ownShipWorldId()) then
        destination.warpAction = "Nowhere"; --If a player is already on their ship - do not offer to warp there even if config lists it
      end

      local currentBookmark = mel_tp.bookmarkTemplate
      local iconPath = ""
      if destination.icon ~= nil then
          iconPath = ("/interface/bookmarks/icons/" .. destination.icon) .. ".png"
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


populateBookmarks()

function btnDumpTp:onClick()
  --chat.addMessage("boop")
  lblDebug:setText(sb.printJson(mel_tp.bookmarks))
end

function btnSortByPlanet:onClick()
  table.sort(mel_tp.data, function(el1, el2) return el1.targetName:upper() < el2.targetName:upper() end)
  populateBookmarks()
end

function btnTeleport:onClick()
  if mel_tp.selected == nil then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    lblDump.setText("No target selected")
    return
end

  if(mel_tp.selected == nil) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  local warpTarget =   mel_tp.selected.warpAction
  if(type(warpTarget) ~= "string") then
    warpTarget = mel_tp.selected.warpAction[1]..tostring(mel_tp.selected.warpAction[2] and "=" .. tostring(mel_tp.selected.warpAction[2]) or "")
  end
  
  lblDump:setText(warpTarget)
  widget.playSound("/sfx/interface/ship_confirm1.ogg")
  player.warp(warpTarget, "default")
  pane.dismiss()
end