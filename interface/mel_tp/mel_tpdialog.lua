-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"

local mel_tp = {}

local function init() 
  mel_tp.tpListRef = self

  self.data = player.teleportBookmarks()
  -- self.tplist = 
  -- "lstTestPortal"
  widget.setText("tpName", self.data[0].bookmarkName)
  widget.setText("tpPlanetName", self.data[0].targetName)
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
  lblDebug:setText(sb.printJson(player.teleportBookmarks()))
  sb.logInfo(sb.printJson(player.teleportBookmarks()))
end

