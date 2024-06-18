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


-- POPULATING LIST

-- auto config = assets->fetchJson(interactAction.data);
--     if (config.getBool("canBookmark", false)) {
--       if (auto entity = world->entity(interactAction.entityId)) {
--         if (auto uniqueEntityId = entity->uniqueId()) {
--           auto worldTemplate = m_client->worldClient()->currentTemplate();

--           String icon, planetName;
--           if (m_client->playerWorld().is<ClientShipWorldId>()) {
--             icon = "ship";
--             planetName = "Player Ship";
--           } else if (m_client->playerWorld().is<CelestialWorldId>()) {
--             icon = worldTemplate->worldParameters()->typeName;
--             planetName = worldTemplate->worldName();
--           } else if (m_client->playerWorld().is<InstanceWorldId>()) {
--             icon = worldTemplate->worldParameters()->typeName;
--             planetName = worldTemplate->worldName();
--           } else {
--             icon = "default";
--             planetName = "???";
--           }

--           currentLocation = TeleportBookmark{
--             {m_client->playerWorld(), SpawnTargetUniqueEntity(*uniqueEntityId)},
--             planetName,
--             config.getString("bookmarkName", ""),
--             icon};

--           if (!m_client->mainPlayer()->universeMap()->teleportBookmarks().contains(currentLocation) || !config.getBool("canTeleport", true)) {
--             auto editBookmarkDialog = make_shared<EditBookmarkDialog>(m_client->mainPlayer()->universeMap());
--             editBookmarkDialog->setBookmark(currentLocation);
--             m_paneManager.displayPane(PaneLayer::ModalWindow, editBookmarkDialog);
--             return;
--           }
--         }
--       }
--     }


-- GENERATING WINDOW

-- namespace Star {

--   TeleportDialog::TeleportDialog(UniverseClientPtr client,
--       PaneManager* paneManager,
--       Json config,
--       EntityId sourceEntityId,
--       TeleportBookmark currentLocation) {
--     m_client = client;
--     m_paneManager = paneManager;
--     m_sourceEntityId = sourceEntityId;
--     m_currentLocation = currentLocation;
  
--     auto assets = Root::singleton().assets();
  
--     GuiReader reader;
  
--     reader.registerCallback("dismiss", bind(&Pane::dismiss, this));
--     reader.registerCallback("teleport", bind(&TeleportDialog::teleport, this));
--     reader.registerCallback("selectDestination", bind(&TeleportDialog::selectDestination, this));
  
--     reader.construct(assets->json("/interface/windowconfig/teleportdialog.config:paneLayout"), this);
  
--     config = assets->fetchJson(config);
--     auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
--     destList->registerMemberCallback("editBookmark", bind(&TeleportDialog::editBookmark, this));
  
--     for (auto dest : config.getArray("destinations", JsonArray())) {
--       if (auto prerequisite = dest.optString("prerequisiteQuest")) {
--         if (!m_client->mainPlayer()->questManager()->hasCompleted(*prerequisite))
--           continue;
--       }
  
--       auto warpAction = parseWarpAction(dest.getString("warpAction"));
--       bool deploy = dest.getBool("deploy", false);
--       if (warpAction == WarpAlias::OrbitedWorld && !m_client->canBeamDown(deploy))
--         continue;
  
--       auto entry = destList->addItem();
--       entry->fetchChild<LabelWidget>("name")->setText(dest.getString("name"));
--       entry->fetchChild<LabelWidget>("planetName")->setText(dest.getString("planetName", ""));
--       if (dest.contains("icon"))
--         entry->fetchChild<ImageWidget>("icon")->setImage(
--             strf("/interface/bookmarks/icons/{}.png", dest.getString("icon")));
--       entry->fetchChild<ButtonWidget>("editButton")->hide();
  
--       if (dest.getBool("mission", false)) {
--         // if the warpaction is for an instance world, set the uuid to the team uuid
--         if (auto warpToWorld = warpAction.ptr<WarpToWorld>()) {
--           if (auto worldId = warpToWorld->world.ptr<InstanceWorldId>())
--             warpAction = WarpToWorld(InstanceWorldId(worldId->instance, m_client->teamUuid(), worldId->level), warpToWorld->target);
--         }
--       }
  
--       m_destinations.append({warpAction, deploy});
--     }
  
--     String beamPartyMember = assets->json("/interface/windowconfig/teleportdialog.config:beamPartyMemberLabel").toString();
--     String deployPartyMember = assets->json("/interface/windowconfig/teleportdialog.config:deployPartyMemberLabel").toString();
--     String beamPartyMemberIcon = assets->json("/interface/windowconfig/teleportdialog.config:beamPartyMemberIcon").toString();
--     String deployPartyMemberIcon = assets->json("/interface/windowconfig/teleportdialog.config:deployPartyMemberIcon").toString();
  
--     if (config.getBool("includePartyMembers", false)) {
--       auto teamClient = m_client->teamClient();
--       for (auto member : teamClient->members()) {
--         if (member.uuid == m_client->clientContext()->playerUuid() || member.warpMode == WarpMode::None)
--           continue;
  
--         auto entry = destList->addItem();
--         entry->fetchChild<LabelWidget>("name")->setText(member.name);
  
--         if (member.warpMode == WarpMode::DeployOnly)
--           entry->fetchChild<LabelWidget>("planetName")->setText(deployPartyMember);
--         else
--           entry->fetchChild<LabelWidget>("planetName")->setText(beamPartyMember);
  
--         if (member.warpMode == WarpMode::DeployOnly)
--           entry->fetchChild<ImageWidget>("icon")->setImage(deployPartyMemberIcon);
--         else
--           entry->fetchChild<ImageWidget>("icon")->setImage(beamPartyMemberIcon);
  
--         entry->fetchChild<ButtonWidget>("editButton")->hide();
  
--         m_destinations.append({WarpToPlayer(member.uuid), member.warpMode == WarpMode::DeployOnly});
--       }
--     }
  
--     if (config.getBool("includePlayerBookmarks", false)) {
--       auto teleportBookmarks = m_client->mainPlayer()->universeMap()->teleportBookmarks();
  
--       teleportBookmarks.sort([](auto const& a, auto const& b) { return a.bookmarkName.toLower() < b.bookmarkName.toLower(); });
  
--       for (auto bookmark : teleportBookmarks) {
--         auto entry = destList->addItem();
--         setupBookmarkEntry(entry, bookmark);
--         if (bookmark == m_currentLocation) {
--           destList->setEnabled(destList->itemPosition(entry), false);
--           entry->fetchChild<ButtonWidget>("editButton")->setEnabled(false);
--         }
--         m_destinations.append({WarpToWorld(bookmark.target.first, bookmark.target.second), false});
--       }
--     }
  
--     fetchChild<ButtonWidget>("btnTeleport")->setEnabled(destList->selectedItem() != NPos);
--   }
  
--   void TeleportDialog::tick(float) {
--     if (!m_client->worldClient()->playerCanReachEntity(m_sourceEntityId))
--       dismiss();
--   }
  
--   void TeleportDialog::selectDestination() {
--     auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
--     fetchChild<ButtonWidget>("btnTeleport")->setEnabled(destList->selectedItem() != NPos);
--   }
  
--   void TeleportDialog::teleport() {
--     auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
--     if (destList->selectedItem() != NPos) {
--       auto& destination = m_destinations[destList->selectedItem()];
--       auto warpAction = destination.first;
--       bool deploy = destination.second;
  
--       auto warp = [this, deploy](WarpAction const& action, String const& animation = "default") {
--         if (deploy)
--           m_client->warpPlayer(action, true, "deploy", true);
--         else
--           m_client->warpPlayer(action, true, animation);
--       };
  
--       m_client->worldClient()->sendEntityMessage(m_sourceEntityId, "onTeleport", {printWarpAction(warpAction)});
--       if (warpAction.is<WarpAlias>() && warpAction.get<WarpAlias>() == WarpAlias::OrbitedWorld) {
--         warp(take(destination).first, "beam");
--       } else {
--         warp(take(destination).first);
--       }
--       dismiss();
--     }
--   }
  
--   void TeleportDialog::editBookmark() {
--     auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
--     if (destList->selectedItem() != NPos) {
--       size_t selectedItem = destList->selectedItem();
--       auto bookmarks = m_client->mainPlayer()->universeMap()->teleportBookmarks();
--       bookmarks.sort([](auto const& a, auto const& b) { return a.bookmarkName.toLower() < b.bookmarkName.toLower(); });
--       selectedItem = selectedItem - (m_destinations.size() - bookmarks.size());
--       if (bookmarks.size() > selectedItem) {
--         auto editBookmarkDialog = make_shared<EditBookmarkDialog>(m_client->mainPlayer()->universeMap());
--         editBookmarkDialog->setBookmark(bookmarks[selectedItem]);
--         m_paneManager->displayPane(PaneLayer::ModalWindow, editBookmarkDialog);
--       }
--       dismiss();
--     }
--   }
  
--   }