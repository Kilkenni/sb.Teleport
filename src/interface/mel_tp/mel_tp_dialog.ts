//require "/scripts/util.lua"
//require "/scripts/vec2.lua"
// import {pane, player, sb, widget, SbTypes} from "../../../src_sb_typedefs/StarboundLua";
import {metagui, bookmarksList, btnDumpTp, btnSortByPlanet, bookmarkInfo, lblBkmName, lblBkmLocType, btnFallback, btnTeleport, lblDebug, lblDump, tpItem} from "./mel_tp_dialog.ui";
import { sortArrayByProperty, getSpaceLocationType, WorldIdToObject, ObjectToWorldId, parseWorldIdFull, JsonToDestination, TargetToWarpCommand } from "./mel_tp_util";

export interface Destination {
  name : string, //equivalent of Bookmark.bookmarkName. Default: ""
  planetName : string, //equivalent of Bookmark.targetName. Default: "???"
  warpAction : WarpAction, //equivalent of Bookmark.target.
  icon : string, //equivalent of Bookmark.icon
  deploy? : boolean, //Deploy mech. Default: false
  mission? : boolean, //Default: false
  prerequisiteQuest? : any, //if the player has not completed the quest, destination is not available
}

const mel_tp:{
  bookmarks: Bookmark[]|undefined,
  bookmarkTemplate: tpItem,
  configPath: string,
  configOverride: TeleportConfig|undefined,
  selected: Destination|undefined
  animation: string,
  dialogConfig: TpDialogConfig|undefined
} = {
  bookmarks: undefined,
  bookmarkTemplate: bookmarksList.data,
  configPath: "",
  configOverride: undefined,
  selected: undefined,
  animation: "default",
  dialogConfig: root.assetJson("/interface/mel_tp/mel_tp.config") as unknown as TpDialogConfig
};
mel_tp.bookmarks = player.teleportBookmarks() as Bookmark[];
mel_tp.bookmarkTemplate = bookmarksList.data;
mel_tp.configPath = metagui.inputData.configPath as string;
sb.logInfo(metagui.inputData.configPath);
mel_tp.configOverride = root.assetJson(mel_tp.configPath) as unknown as TeleportConfig;

/*
  {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    "icon":"garden",
    "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    "bookmarkName":"Merchant test"}
*/
function OnTpTargetSelect(bookmarkWidget:any):void {
  mel_tp.selected = bookmarkWidget.bkmData as Destination;
  if(typeof mel_tp.selected.warpAction === "string") {
    lblBkmName.setText("");
    lblBkmLocType.setText("Special system alias signature");
  }
  else if((mel_tp.selected.warpAction as PlayerTarget)[0] === "player") {
    lblBkmName.setText("");
    lblBkmLocType.setText("Player signature");
  }
  else if((mel_tp.selected.warpAction as UuidTarget)[0] === "object" ) {
    lblBkmName.setText("");
    lblBkmLocType.setText("Object Uuid signature");
  }
  else {
    const warpTarget:WorldIdString = (mel_tp.selected.warpAction as BookmarkTarget)[0];
    const coord:CelestialCoordinate|InstanceWorldId|null = WorldIdToObject(warpTarget)
    if(coord === null) {
      lblBkmName.setText("");
      lblBkmLocType.setText("");
    }
    else {
      if((coord as CelestialCoordinate).location !== undefined) {
        //TypeGuard: coord is a CelestialCoordinate
        const name = celestial.planetName(coord as CelestialCoordinate);
        const planetParams = celestial.visitableParameters(coord as CelestialCoordinate);
        if(name !== null) {
          lblBkmName.setText(name);
        }
        if(planetParams !== null) {
          lblBkmLocType.setText(planetParams.typeName);
          //debug line
          // sb.logInfo(sb.printJson(planetParams as unknown as JSON));
        }
      }
      else {
        //coord is an InstanceWorldId
        const instanceId = coord as InstanceWorldId;
        if(instanceId.instance !== null) {
          lblBkmName.setText(instanceId.instance);
        }
        if(instanceId.level !== "-") {
          lblBkmLocType.setText("Level ${instanceId.level}");
        }
      }      
    }
  }
  
  lblDump.setText(sb.printJson(bookmarkWidget.bkmData));
};

function populateBookmarks() {
  bookmarksList.clearChildren()

  const finalTpConfig:TeleportConfig = {
    canBookmark : mel_tp.configOverride?.canBookmark || false, //default: false
    canTeleport : mel_tp.configOverride?.canTeleport || true, //default: true.
    includePartyMembers : mel_tp.configOverride?.includePartyMembers || false, //default: false
    includePlayerBookmarks : mel_tp.configOverride?.includePlayerBookmarks || false, //Default: false
    destinations : mel_tp.configOverride?.destinations || undefined, //array of additional destinations
  };

  //process player bookmarks
  /*
  EXAMPLE BOOKMARKS
  {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    "icon":"garden",
    "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    "bookmarkName":"Merchant test"}

  {"targetName":"",
  "icon":"outpost",
  "target":["InstanceWorld:outpost:-:-","arkteleporter"],
  "bookmarkName":"Outpost - The Ark"}
  */
  if(finalTpConfig.includePlayerBookmarks && mel_tp.bookmarks !== undefined) {
    mel_tp.bookmarks.forEach((bookmark:Bookmark, index:number):void => {
      const currentBookmark = mel_tp.bookmarkTemplate as tpItem;
      let iconPath = "";
      if(bookmark.icon !== undefined) {
        iconPath = `/interface/bookmarks/icons/${bookmark.icon}.png`;
      }
  
      const bkmData: Destination = {
        //system = false //for special locations like ship etc
        warpAction: bookmark.target as BookmarkTarget, //warp coords or command
        name: bookmark.bookmarkName || "???", //default: ???
        planetName: bookmark.targetName || "", //default: empty string
        icon: iconPath, //default: no icon
        deploy: false, //Deploy mech. Default: false
        // mission: false, //Default: false
        // prerequisiteQuest: false, //if the player has not completed the quest, destination is not available
      };
  
      currentBookmark.id = currentBookmark.id + index;
      
      currentBookmark.children[0].id = currentBookmark.children[0].id + index;
      currentBookmark.children[1].id = currentBookmark.children[1].id + index;
      currentBookmark.children[2].id = currentBookmark.children[2].id + index;
      currentBookmark.children[0].file = bkmData.icon;
      currentBookmark.children[1].text = bkmData.name;
      currentBookmark.children[2].text = bkmData.planetName;
      /*
    { "type": "listItem", "id" : "tpBookmark", "children": [
      { "type": "image", "id":"tpIcon", "file": ""},
      {"type":"label", "id":"tpName", "text": "name"},
      {"type": "label", "id":"tpPlanetName", "text": "planet"}
      ],
      "data": {"target": null}
    }
*/
      const addedBookmark = bookmarksList.addChild(currentBookmark);
      addedBookmark.onSelected = OnTpTargetSelect;
      addedBookmark.bkmData = bkmData;
    })
  };

  //process additional locations from override config
  if(finalTpConfig.destinations !== undefined) {
    finalTpConfig.destinations.forEach((dest:JsonDestination, index:number):void => {
      //Skip unavailable destinations in config
      const destination:Destination = JsonToDestination(dest);
      if(destination.prerequisiteQuest && player.hasCompletedQuest(destination.prerequisiteQuest) === false) {
        return; //Quest not complete - skip this Destination
      }
      if(destination.warpAction === WarpAlias.OrbitedWorld) {
        const shipLocation: SystemLocationJson = celestial.shipLocation(); //allow warp only if CelestialCoordinate
        const locationType = getSpaceLocationType(shipLocation);
        if(locationType.toString() !== "CelestialCoordinate"){
          return; //Warping down is available only when orbiting a planet
        }       
      }
      if(destination.warpAction === WarpAlias.OwnShip && player.worldId() === player.ownShipWorldId()) {
        return; //If a player is already on their ship - do not offer to warp there even if config lists it
      }

      //Add destination from config to TP targets
      const currentBookmark = mel_tp.bookmarkTemplate as tpItem;
      let iconPath = "";
      if(destination.icon !== undefined) {
        iconPath =`/interface/bookmarks/icons/${destination.icon}.png`;
      }

      if (destination.mission === true && typeof destination.warpAction !== "string") {
        // if the warpAction is for an instance world, set the uuid to the team uuid -- or so the source code claims
        //we assume it is BookmarkTarget since Json configs can't teleport to dynamic objects or players, and it's not Alias
        const warpAction = destination.warpAction as BookmarkTarget;
        if(warpAction[0].includes("InstanceWorld")) {
          //we have InstanceWorld here folks
          const teamUuid:Uuid = ""; //TODO Fix this! We need to insert Team Uuid here
          destination.warpAction = [warpAction[0], teamUuid] as BookmarkTarget;
        }
      }

      /*
      if (dest.getBool("mission", false)) {
        // if the warpaction is for an instance world, set the uuid to the team uuid
        if (auto warpToWorld = warpAction.ptr<WarpToWorld>()) {
          if (auto worldId = warpToWorld->world.ptr<InstanceWorldId>())
            warpAction = WarpToWorld(InstanceWorldId(worldId->instance, m_client->teamUuid(), worldId->level), warpToWorld->target);
        }
      }
      */

      if(finalTpConfig.includePartyMembers === true) {
        const beamPartyMember = mel_tp.dialogConfig?.mel_tp_dialog["beamPartyMemberLabel"];
        const deployPartyMember  = mel_tp.dialogConfig?.mel_tp_dialog["deployPartyMemberLabel"];
        const beamPartyMemberIcon = mel_tp.dialogConfig?.mel_tp_dialog["beamPartyMemberIcon"];
        const deployPartyMemberIcon = mel_tp.dialogConfig?.mel_tp_dialog["deployPartyMemberIcon"];
        //add warp options for each party member

        //TODO find how to get party members
      }
      
      /*
      
  
    if (config.getBool("includePartyMembers", false)) {
      auto teamClient = m_client->teamClient();
      for (auto member : teamClient->members()) {
        if (member.uuid == m_client->clientContext()->playerUuid() || member.warpMode == WarpMode::None)
          continue;
  
        auto entry = destList->addItem();
        entry->fetchChild<LabelWidget>("name")->setText(member.name);
  
        if (member.warpMode == WarpMode::DeployOnly)
          entry->fetchChild<LabelWidget>("planetName")->setText(deployPartyMember);
        else
          entry->fetchChild<LabelWidget>("planetName")->setText(beamPartyMember);
  
        if (member.warpMode == WarpMode::DeployOnly)
          entry->fetchChild<ImageWidget>("icon")->setImage(deployPartyMemberIcon);
        else
          entry->fetchChild<ImageWidget>("icon")->setImage(beamPartyMemberIcon);
  
        entry->fetchChild<ButtonWidget>("editButton")->hide();
  
        m_destinations.append({WarpToPlayer(member.uuid), member.warpMode == WarpMode::DeployOnly});
      }
    }
    */
  
      const bkmData: Destination = {
        //system = false //for special locations like ship etc
        warpAction: destination.warpAction, //warp coords or command
        name: destination.name || "???", //default: ???
        planetName: destination.planetName || "", //default: empty string
        icon: iconPath, //default: no icon
        deploy: destination.deploy || false, //Deploy mech. Default: false
        mission: destination.mission || false, //Default: false
        prerequisiteQuest: destination.prerequisiteQuest || false, //if the player has not completed the quest, destination is not available
      };
      
      currentBookmark.children[0].file = bkmData.icon;
      currentBookmark.children[1].text = bkmData.name;
      currentBookmark.children[2].text = bkmData.planetName;
      const addedBookmark = bookmarksList.addChild(currentBookmark);
      addedBookmark.onSelected = OnTpTargetSelect;
      addedBookmark.bkmData = bkmData;
    })
  }

 
  //GENERATING WINDOW
/*
namespace Star {

  TeleportDialog::TeleportDialog(UniverseClientPtr client,
      PaneManager* paneManager,
      Json config,
      EntityId sourceEntityId,
      TeleportBookmark currentLocation) {
  
    config = assets->fetchJson(config);
    auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
    destList->registerMemberCallback("editBookmark", bind(&TeleportDialog::editBookmark, this));
  
    for (auto dest : config.getArray("destinations", JsonArray())) {
  
      auto entry = destList->addItem();
      entry->fetchChild<LabelWidget>("name")->setText(dest.getString("name"));
      entry->fetchChild<LabelWidget>("planetName")->setText(dest.getString("planetName", ""));
      if (dest.contains("icon"))
        entry->fetchChild<ImageWidget>("icon")->setImage(
            strf("/interface/bookmarks/icons/{}.png", dest.getString("icon")));
      entry->fetchChild<ButtonWidget>("editButton")->hide();
  
      if (dest.getBool("mission", false)) {
        // if the warpaction is for an instance world, set the uuid to the team uuid
        if (auto warpToWorld = warpAction.ptr<WarpToWorld>()) {
          if (auto worldId = warpToWorld->world.ptr<InstanceWorldId>())
            warpAction = WarpToWorld(InstanceWorldId(worldId->instance, m_client->teamUuid(), worldId->level), warpToWorld->target);
        }
      }
  
      m_destinations.append({warpAction, deploy});
    }
  
    String beamPartyMember = assets->json("/interface/windowconfig/teleportdialog.config:beamPartyMemberLabel").toString();
    String deployPartyMember = assets->json("/interface/windowconfig/teleportdialog.config:deployPartyMemberLabel").toString();
    String beamPartyMemberIcon = assets->json("/interface/windowconfig/teleportdialog.config:beamPartyMemberIcon").toString();
    String deployPartyMemberIcon = assets->json("/interface/windowconfig/teleportdialog.config:deployPartyMemberIcon").toString();
  
    if (config.getBool("includePartyMembers", false)) {
      auto teamClient = m_client->teamClient();
      for (auto member : teamClient->members()) {
        if (member.uuid == m_client->clientContext()->playerUuid() || member.warpMode == WarpMode::None)
          continue;
  
        auto entry = destList->addItem();
        entry->fetchChild<LabelWidget>("name")->setText(member.name);
  
        if (member.warpMode == WarpMode::DeployOnly)
          entry->fetchChild<LabelWidget>("planetName")->setText(deployPartyMember);
        else
          entry->fetchChild<LabelWidget>("planetName")->setText(beamPartyMember);
  
        if (member.warpMode == WarpMode::DeployOnly)
          entry->fetchChild<ImageWidget>("icon")->setImage(deployPartyMemberIcon);
        else
          entry->fetchChild<ImageWidget>("icon")->setImage(beamPartyMemberIcon);
  
        entry->fetchChild<ButtonWidget>("editButton")->hide();
  
        m_destinations.append({WarpToPlayer(member.uuid), member.warpMode == WarpMode::DeployOnly});
      }
    }
  
    
  
    fetchChild<ButtonWidget>("btnTeleport")->setEnabled(destList->selectedItem() != NPos);
  }
  
  
  void TeleportDialog::teleport() {
    auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
    if (destList->selectedItem() != NPos) {
      auto& destination = m_destinations[destList->selectedItem()];
      auto warpAction = destination.first;
      bool deploy = destination.second;
  
      auto warp = [this, deploy](WarpAction const& action, String const& animation = "default") {
        if (deploy)
          m_client->warpPlayer(action, true, "deploy", true);
        else
          m_client->warpPlayer(action, true, animation);
      };
  
      m_client->worldClient()->sendEntityMessage(m_sourceEntityId, "onTeleport", {printWarpAction(warpAction)});
      if (warpAction.is<WarpAlias>() && warpAction.get<WarpAlias>() == WarpAlias::OrbitedWorld) {
        warp(take(destination).first, "beam");
      } else {
        warp(take(destination).first);
      }
      dismiss();
    }
  }
  
  }
  */
    


  //tpName:setText(mel_tp.bookmarks[1].bookmarkName)
  //tpPlanetName:setText(mel_tp.bookmarks[1].targetName)
  metagui.queueFrameRedraw()
}

if(mel_tp.bookmarks !== undefined) {
  mel_tp.bookmarks = sortArrayByProperty(mel_tp.bookmarks, "bookmarkName", false) as unknown as Bookmark[];
}
populateBookmarks()

/*
function init():void { 
}

function updateGui():void {
}

function uninit():void {
}
*/

btnDumpTp.onClick = function ():void {
  //chat.addMessage("boop")
  lblDebug.setText(sb.printJson(mel_tp.bookmarks as unknown as JSON))
}

btnSortByPlanet.onClick = function ():void {
  if(mel_tp.bookmarks === undefined) {
    return;
  }
  mel_tp.bookmarks = sortArrayByProperty(mel_tp.bookmarks, "targetName", false) as unknown as Bookmark[];
  populateBookmarks();
  // if(mel_tp.bookmarks === undefined) {
  //   return;
  // }
  // mel_tp.bookmarks = mel_tp.bookmarks.sort((el1, el2) => {return el1.targetName.toLowerCase() < el2.targetName.toLowerCase()? -1 : 1 })
  // populateBookmarks()
 //lblDump:setText(sb.printJson(sorted))

  //tpName:setText(sb.printJson(mel_tp.bookmarks[1].bookmarkName))
  //tpPlanetName:setText(mel_tp.bookmarks[1].targetName)
  //tpIcon:setFile("/interface/bookmarks/icons/" .. mel_tp.bookmarks[1].icon..".png")
}

btnTeleport.onClick = function() {
  if(mel_tp.selected == undefined) {
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump.setText("No target selected")
    return
  }
  // let tempWarpTarget:WarpAction = mel_tp.selected.warpAction;
  const warpTarget:string = TargetToWarpCommand(mel_tp.selected.warpAction)
  // if(typeof tempWarpTarget === "string"){
  //   //WarpAction is a WarpAlias
  //   warpTarget = tempWarpTarget;
  // }
  // else {
  //   //WarpAction is an array
  //   // const [target, spawn] = tempWarpTarget as BookmarkTarget|PlayerTarget|UuidTarget;
    
  //   // warpTarget = mel_tp.selected.warpAction[0]+(mel_tp.selected.warpAction[1]? "="+mel_tp.selected.warpAction[1] : "");
  //   warpTarget = TargetToWarpCommand(tempWarpTarget as (PlayerTarget|UuidTarget|BookmarkTarget));
  // }

  lblDump.setText(`Stringified warp target: ${warpTarget}`);
  widget.playSound("/sfx/interface/ship_confirm1.ogg");
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy || false);
  pane.dismiss();
}

btnFallback.onClick = function() {
  activeItem.interact("OpenTeleportDialog", mel_tp.configPath,pane.sourceEntity());
  pane.dismiss();
}

//Dismissing by out-of reach is in-built in ScriptPane, so this is not needed
/*
function update(dt:number) {
  if(pane.sourceEntity() === player.id()) {
    return; //player can't be out of range of themself, baka
  }
  if(false) {
    pane.dismiss()
  }
}
*/

 //EDIT BOOKMARK OPTION

/*
  auto config = assets->fetchJson(interactAction.bookmarks);
  if (config.getBool("canBookmark", false)) {
    if (auto entity = world->entity(interactAction.entityId)) {
      if (auto uniqueEntityId = entity->uniqueId()) {
        auto worldTemplate = m_client->worldClient()->currentTemplate();

        String icon, planetName;
        if (m_client->playerWorld().is<ClientShipWorldId>()) {
          icon = "ship";
          planetName = "Player Ship";
        } else if (m_client->playerWorld().is<CelestialWorldId>()) {
          icon = worldTemplate->worldParameters()->typeName;
          planetName = worldTemplate->worldName();
        } else if (m_client->playerWorld().is<InstanceWorldId>()) {
          icon = worldTemplate->worldParameters()->typeName;
          planetName = worldTemplate->worldName();
        } else {
          icon = "default";
          planetName = "???";
        }

        currentLocation = TeleportBookmark{
          {m_client->playerWorld(), SpawnTargetUniqueEntity(*uniqueEntityId)},
          planetName,
          config.getString("bookmarkName", ""),
          icon};

        if (!m_client->mainPlayer()->universeMap()->teleportBookmarks().contains(currentLocation) || !config.getBool("canTeleport", true)) {
          auto editBookmarkDialog = make_shared<EditBookmarkDialog>(m_client->mainPlayer()->universeMap());
          editBookmarkDialog->setBookmark(currentLocation);
          m_paneManager.displayPane(PaneLayer::ModalWindow, editBookmarkDialog);
          return;
        }
      }
    }
  }
  */

/*

void TeleportDialog::editBookmark() {
    auto destList = fetchChild<ListWidget>("bookmarkList.bookmarkItemList");
    if (destList->selectedItem() != NPos) {
      size_t selectedItem = destList->selectedItem();
      auto bookmarks = m_client->mainPlayer()->universeMap()->teleportBookmarks();
      bookmarks.sort([](auto const& a, auto const& b) { return a.bookmarkName.toLower() < b.bookmarkName.toLower(); });
      selectedItem = selectedItem - (m_destinations.size() - bookmarks.size());
      if (bookmarks.size() > selectedItem) {
        auto editBookmarkDialog = make_shared<EditBookmarkDialog>(m_client->mainPlayer()->universeMap());
        editBookmarkDialog->setBookmark(bookmarks[selectedItem]);
        m_paneManager->displayPane(PaneLayer::ModalWindow, editBookmarkDialog);
      }
      dismiss();
    }
  }
*/

