-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"

local mel_tp = {}
mel_tp.data = player.teleportBookmarks()
 -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

function OnTpTargetSelect(bookmarkWidget)
  bookmarksList.selected = bookmarkWidget.bkmData
  lblDump:setText(sb.printJson(bookmarkWidget.bkmData))
end

local function populateBookmarks()
  bookmarksList:clearChildren()
  for index, bookmark in ipairs(mel_tp.data) do
    local currentBookmark = mel_tp.bookmarkTemplate

    -- { "type": "listItem", "id" : "tpBookmark", "children": [
    --   { "type": "image", "id":"tpIcon", "file": ""},
    --   {"type":"label", "id":"tpName", "text": "name"},
    --   {"type": "label", "id":"tpPlanetName", "text": "planet"}
    --   ],
    --   "data": {"target": null}
    -- }

    local iconPath = ("/interface/bookmarks/icons/" .. bookmark.icon..".png")

    local bkmData = {
      --system = false --for special locations like ship etc
      target = bookmark.target,
      bkmName = bookmark.bookmarkName or "???",
      locDesc = bookmark.targetName or "",
      icon = iconPath or ""
    }

    currentBookmark.id = currentBookmark.id .. index
    -- tpName:setText(sb.printJson(mel_tp.data[1].bookmarkName))
    -- tpPlanetName:setText(mel_tp.data[1].targetName)
    -- tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.data[1].icon..".png")
    
    currentBookmark.children[1].id = currentBookmark.children[1].id .. index
    currentBookmark.children[2].id = currentBookmark.children[2].id .. index
    currentBookmark.children[3].id = currentBookmark.children[3].id .. index
    currentBookmark.children[1].file = bkmData.icon
    currentBookmark.children[2].text = bkmData.bkmName
    currentBookmark.children[3].text = bkmData.locDesc
    -- currentBookmark.bkmData = bkmData
    local addedBookmark = bookmarksList:addChild(currentBookmark)
    addedBookmark.onSelected = OnTpTargetSelect
    addedBookmark.bkmData = bkmData
  end
  -- tpName:setText(mel_tp.data[1].bookmarkName)
  -- tpPlanetName:setText(mel_tp.data[1].targetName)
  metagui.queueFrameRedraw()
end

mel_tp.bookmarkTemplate = bookmarksList.data
populateBookmarks()



local function init()  
  -- tpName:setText(mel_tp.data[1].bookmarkName)
  -- tpPlanetName:setText(mel_tp.data[1].targetName)
  -- {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    -- "icon":"garden",
    -- "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    -- "bookmarkName":"Merchant test"}

-- {"targetName":"",
-- "icon":"outpost",
-- "target":["InstanceWorld:outpost:-:-","arkteleporter"],
-- "bookmarkName":"Outpost - The Ark"}


end

local function updateGui()

end

local function uninit()

end

function btnDumpTp:onClick()
  --chat.addMessage("boop")
  lblDebug:setText(sb.printJson(mel_tp.data))
end

function btnSortByPlanet:onClick()
  table.sort(mel_tp.data, function(el1, el2) return el1.targetName:upper() < el2.targetName:upper() end)
  populateBookmarks()
 -- lblDump:setText(sb.printJson(sorted))

  -- tpName:setText(sb.printJson(mel_tp.data[1].bookmarkName))
  -- tpPlanetName:setText(mel_tp.data[1].targetName)
  -- tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.data[1].icon..".png")
end

function btnTeleport:onClick()
  -- local selectedIndex = 0
  -- for bookmarkIndex, bookmark in ipairs(mel_tp.data) do 
  --   local keyset={}
  --   local n=0


  --   -- bookmarksList:subscribeEvent("listItemSelected", function(self, itm)
  --   --   lblDump:setText(itm.id)
  --   --   sb.logInfo(itm);
  --   -- end)

  --   -- for k,v in pairs(bookmark.backingWidget) do
  --   --   n=n+1
  --   --   keyset[n]=k
  --   -- end

  --   -- lblDump:setText("keys " .. table.unpack(keyset))  
  --   -- bookmark:onClick()
  --   local widgetNm = bookmark.children.backingWidget
  --   sb.logInfo(bookmark.backingWidget)
  --   -- sb.logInfo(sb.print(widget.getListSelected(bookmark.backingWidget, false)))
  --   if(bookmark.selected == true) then
  --     selectedIndex = bookmarkIndex
  --   end
  -- end
  -- lblDump:setText(selectedIndex)
  if(not bookmarksList.selected) then
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump:setText("No target selected")
    return
  end
  lblDump:setText(bookmarksList.selected.target[1].."="..bookmarksList.selected.target[2])
  widget.playSound("/sfx/interface/ship_confirm1.ogg")
  player.warp(bookmarksList.selected.target[1].."="..bookmarksList.selected.target[2], "default")
  pane.dismiss()
end