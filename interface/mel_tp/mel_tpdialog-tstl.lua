--[[local ____lualib = --]] require("/interface/mel_tp/lualib_bundle.lua")
-- local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
-- local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local ____exports = {}
--[[local ____mel_tp_util = --]] require("/interface/mel_tp/mel_tp_util.lua")
-- local sortArrayByProperty = ____mel_tp_util.sortArrayByProperty
-- local getSpaceLocationType = ____mel_tp_util.getSpaceLocationType
-- local WorldIdToObject = ____mel_tp_util.WorldIdToObject
-- local JsonToDestination = ____mel_tp_util.JsonToDestination
-- local TargetToWarpCommand = ____mel_tp_util.TargetToWarpCommand
local mel_tp = {
    bookmarks = nil,
    bookmarkTemplate = bookmarksList.data,
    configOverride = nil,
    selected = nil,
    animation = "default"
}
mel_tp.bookmarks = player:teleportBookmarks()
mel_tp.bookmarkTemplate = bookmarksList.data
mel_tp.configOverride = metagui.inputData

local function OnTpTargetSelect(self, bookmarkWidget)
    mel_tp.selected = bookmarkWidget.bkmData
    if type(mel_tp.selected.warpAction) == "string" then
        lblBkmName:setText("")
        lblBkmLocType:setText("Special system alias signature")
    elseif mel_tp.selected.warpAction[1] == "player" then
        lblBkmName:setText("")
        lblBkmLocType:setText("Player signature")
    elseif mel_tp.selected.warpAction[1] == "object" then
        lblBkmName:setText("")
        lblBkmLocType:setText("Object Uuid signature")
    else
        local warpTarget = mel_tp.selected.warpAction[1]
        local coord = WorldIdToObject(nil, warpTarget)
        if coord == nil then
            lblBkmName:setText("")
            lblBkmLocType:setText("")
        else
            if coord.location == nil then
                local name = celestial:planetName(coord)
                local planetParams = celestial:visitableParameters(coord)
                if name ~= nil then
                    lblBkmName:setText(name)
                end
                if planetParams ~= nil then
                    lblBkmLocType:setText(planetParams.typeName)
                end
                sb:logInfo(sb:printJson(planetParams))
            else
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
    lblDump:setText(sb:printJson(bookmarkWidget.bkmData))
end

local function populateBookmarks(self)
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
        __TS__ArrayForEach(
            mel_tp.bookmarks,
            function(____, bookmark, index)
                local currentBookmark = mel_tp.bookmarkTemplate
                local iconPath = ""
                if bookmark.icon ~= nil then
                    iconPath = ("/interface/bookmarks/icons/" .. bookmark.icon) .. ".png"
                end
                local bkmData = {
                    warpAction = bookmark.target,
                    name = bookmark.bookmarkName or "???",
                    planetName = bookmark.targetName or "",
                    icon = iconPath,
                    deploy = false
                }
                currentBookmark.id = currentBookmark.id .. tostring(index)
                currentBookmark.children[1].id = currentBookmark.children[1].id .. tostring(index)
                currentBookmark.children[2].id = currentBookmark.children[2].id .. tostring(index)
                currentBookmark.children[3].id = currentBookmark.children[3].id .. tostring(index)
                currentBookmark.children[1].file = bkmData.icon
                currentBookmark.children[2].text = bkmData.name
                currentBookmark.children[3].text = bkmData.planetName
                local addedBookmark = bookmarksList:addChild(currentBookmark)
                addedBookmark.onSelected = OnTpTargetSelect
                addedBookmark.bkmData = bkmData
            end
        )
    end
    if finalTpConfig.destinations ~= nil then
        __TS__ArrayForEach(
            finalTpConfig.destinations,
            function(____, dest, index)
                local destination = JsonToDestination(nil, dest)
                if destination.prerequisiteQuest and player:hasCompletedQuest(destination.prerequisiteQuest) == false then
                    return
                end
                if destination.warpAction == WarpAlias.OrbitedWorld then
                    local shipLocation = celestial:shipLocation()
                    local locationType = getSpaceLocationType(nil, shipLocation)
                    if tostring(locationType) ~= "CelestialCoordinate" then
                        return
                    end
                end
                if destination.warpAction == WarpAlias.OwnShip and player:worldId() == player:ownShipWorldId() then
                    return
                end
                local currentBookmark = mel_tp.bookmarkTemplate
                local iconPath = ""
                if destination.icon ~= nil then
                    iconPath = ("/interface/bookmarks/icons/" .. destination.icon) .. ".png"
                end
                if destination.mission == true and type(destination.warpAction) ~= "string" then
                    local warpAction = destination.warpAction
                    if __TS__StringIncludes(warpAction[1], "InstanceWorld") then
                        local teamUuid = ""
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
                currentBookmark.children[1].file = bkmData.icon
                currentBookmark.children[2].text = bkmData.name
                currentBookmark.children[3].text = bkmData.planetName
                local addedBookmark = bookmarksList:addChild(currentBookmark)
                addedBookmark.onSelected = OnTpTargetSelect
                addedBookmark.bkmData = bkmData
            end
        )
    end
    metagui:queueFrameRedraw()
end
if mel_tp.bookmarks ~= nil then
    mel_tp.bookmarks = sortArrayByProperty(nil, mel_tp.bookmarks, "bookmarkName", false)
end
populateBookmarks(nil)
btnDumpTp.onClick = function(self)
    lblDebug:setText(sb:printJson(mel_tp.bookmarks))
end
btnSortByPlanet.onClick = function(self)
    if mel_tp.bookmarks == nil then
        return
    end
    mel_tp.bookmarks = sortArrayByProperty(nil, mel_tp.bookmarks, "targetName", false)
    populateBookmarks(nil)
end
btnTeleport.onClick = function(self)
    if mel_tp.selected == nil then
        widget:playSound("/sfx/interface/clickon_error.ogg")
        lblDump:setText("No target selected")
        return
    end
    local warpTarget = TargetToWarpCommand(nil, mel_tp.selected.warpAction)
    lblDump:setText("Stringified warp target: " .. warpTarget)
    widget:playSound("/sfx/interface/ship_confirm1.ogg")
    player:warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy or false)
    pane:dismiss()
end
return ____exports
