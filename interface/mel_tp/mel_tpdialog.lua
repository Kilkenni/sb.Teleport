-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"

local mel_tp = {}
mel_tp.data = player.teleportBookmarks()

mel_tp.bookmarkTemplate = bookmarksList.data
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

  currentBookmark.id = currentBookmark.id .. index
  -- tpName:setText(sb.printJson(mel_tp.data[1].bookmarkName))
  -- tpPlanetName:setText(mel_tp.data[1].targetName)
  -- tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.data[1].icon..".png")
  
  currentBookmark.children[1].id = currentBookmark.children[1].id .. index
  currentBookmark.children[2].id = currentBookmark.children[2].id .. index
  currentBookmark.children[3].id = currentBookmark.children[3].id .. index
  currentBookmark.children[1].file = "/interface/bookmarks/icons/" .. bookmark.icon..".png"
  currentBookmark.children[2].text = bookmark.bookmarkName
  currentBookmark.children[3].text = bookmark.targetName
  currentBookmark.data.target = bookmark.target
  bookmarksList:addChild(currentBookmark)
end
-- tpName:setText(mel_tp.data[1].bookmarkName)
-- tpPlanetName:setText(mel_tp.data[1].targetName)
metagui.queueFrameRedraw()

local function init() 
  mel_tp.tpListRef = self

  mel_tp.data = player.teleportBookmarks()
  -- self.tplist = 
  -- "lstTestPortal"
  
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

function populateList(collectionName)
  widget.clearListItems(self.list)
  self.collectionName = widget.getSelectedData("collectionTabs")

  if self.collectionName then
    local collection = root.collection(self.collectionName)
    widget.setText("selectLabel", collection.title);
    widget.setVisible("emptyLabel", false)

    self.currentCollectables = {}

    self.playerCollectables = {}
    for _,collectable in pairs(player.collectables(self.collectionName)) do
      self.playerCollectables[collectable] = true
    end

    local collectables = root.collectables(self.collectionName)
    table.sort(collectables, function(a, b) return a.order < b.order end)
    for _,collectable in pairs(collectables) do
      local item = widget.addListItem(self.list)
      
      if collectable.icon ~= "" then
        local imageSize = rect.size(root.nonEmptyRegion(collectable.icon))
        local scaleDown = math.max(math.ceil(imageSize[1] / self.iconSize[1]), math.ceil(imageSize[2] / self.iconSize[2]))

        if not self.playerCollectables[collectable.name] then
          collectable.icon = string.format("%s?multiply=000000", collectable.icon)
        end
        widget.setImage(string.format("%s.%s.icon", self.list, item), collectable.icon)
        widget.setImageScale(string.format("%s.%s.icon", self.list, item), 1 / scaleDown)
      end
      widget.setText(string.format("%s.%s.index", self.list, item), collectable.order)

      self.currentCollectables[string.format("%s.%s", self.list, item)] = collectable;
    end
  else
    widget.setVisible("emptyLabel", true)
    widget.setText("selectLabel", "Collection")
  end
end

function btnDumpTp:onClick()
  --chat.addMessage("boop")
  lblDebug:setText(sb.printJson(bookmarksList.data))
  
end



function btnSelf:onClick()
  -- mel_tp.data = player.teleportBookmarks()
  lblDump:setText(sb.printJson(mel_tp.data))
  sb.logInfo(self.type)

  -- tpName:setText(sb.printJson(mel_tp.data[1].bookmarkName))
  -- tpPlanetName:setText(mel_tp.data[1].targetName)
  -- tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.data[1].icon..".png")
end

function btnTeleport:onClick()
  local selectedIndex = 0
  for bookmarkIndex, bookmark in ipairs(bookmarksList.children) do 
    local keyset={}
    local n=0


    bookmarksList:subscribeEvent("listItemSelected", function(self, itm)
      lblDump:setText(itm.id)
      sb.logInfo(itm);
    end)

    -- for k,v in pairs(bookmark.backingWidget) do
    --   n=n+1
    --   keyset[n]=k
    -- end

    -- lblDump:setText("keys " .. table.unpack(keyset))  
    -- bookmark:onClick()
    local widgetNm = bookmark.children.backingWidget
    sb.logInfo(bookmark.backingWidget)
    -- sb.logInfo(sb.print(widget.getListSelected(bookmark.backingWidget, false)))
    if(bookmark.selected == true) then
      selectedIndex = bookmarkIndex
    end
  end
  -- lblDump:setText(selectedIndex)
  if(selectedIndex == 0) then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    return
  end
  widget.playSound("/sfx/interface/ship_confirm1.ogg")
end