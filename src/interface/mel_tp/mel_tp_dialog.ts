/**
 * This module handles main Teleport ScriptPane constructed with MetaGUI
 */
import {bookmarksList, txtboxFilter, btnResetFilter, btnSortByPlanet, lblBkmName, lblBkmHazards, listHazards, btnEdit, btnFallback, btnTeleport, btnDeploy, lblDump, tpItem, hazardItem} from "./mel_tp_dialog.ui.js";
import mel_tp_util from "./mel_tp_util";

export interface Destination {
  name : string, //equivalent of Bookmark.bookmarkName. Default: ""
  planetName : string, //equivalent of Bookmark.targetName. Default: "???"
  warpAction : WarpAction, //equivalent of Bookmark.target.
  icon : string, //equivalent of Bookmark.icon
  deploy? : boolean, //Deploy mech. Default: false
  mission? : boolean, //Default: false
  prerequisiteQuest? : any, //if the player has not completed the quest, destination is not available
}

declare interface MetaguiTpData {
  configPath?: string, //path to teleport.config. Similar to interactData on vanilla teleporters
  paneIcon?: string, //path to custom icon for teleport window
  paneTitle?: string, //cutom title for teleport window
}

const mel_tp:{
  paneIcon: string,
  paneTitle: string,
  bookmarks: TeleportBookmark[]|undefined,
  filter: string,
  bookmarksFiltered: TeleportBookmark[]|undefined
  bookmarkTemplate: tpItem,
  configPath: string,
  configOverride?: TeleportConfig,
  selected: Destination|undefined,
  animation: string,
  dialogConfig: TpDialogConfig
} = {
  paneIcon: "/interface/warping/icon.png", //default values
  paneTitle: "Teleporter",
  bookmarks: undefined,
  filter: "",
  bookmarksFiltered: undefined,
  bookmarkTemplate: bookmarksList.data,
  configPath: "",
  configOverride: undefined,
  selected: undefined,
  animation: "default",
  dialogConfig: root.assetJson("/interface/mel_tp/mel_tp.config") as unknown as TpDialogConfig
};
mel_tp.bookmarks = player.teleportBookmarks() as TeleportBookmark[];
const sourceEntity = pane.sourceEntity();
if(world.getObjectParameter(sourceEntity, "objectName") !== null) {
  //if sourceEntity is an object
  const entityConfig = root.itemConfig({
    name: world.getObjectParameter(sourceEntity, "objectName") as unknown as string,
    count: 1 as unsigned,
    parameters: {} as unknown as JSON
  });
  if(entityConfig !== null) {
    const iconName = world.getObjectParameter(sourceEntity, "inventoryIcon") as unknown as string;
    mel_tp.paneIcon = entityConfig.directory + iconName; //object icon as pane icon
  }
  // mel_tp.paneIcon = iconName || mel_tp.paneIcon; //try to override using its parameters
  mel_tp.paneTitle = world.getObjectParameter(sourceEntity, "shortdescription") as unknown as string || mel_tp.paneTitle;
}

// sb.logInfo(sb.printJson(sourceEntity as unknown as JSON));
const metaguiTpData:MetaguiTpData|undefined = metagui.inputData;
if(metaguiTpData !== undefined) {
  mel_tp.configPath = metaguiTpData.configPath || "";
  mel_tp.paneIcon = metaguiTpData.paneIcon || mel_tp.paneIcon; //lastly, try to use override from metagui data
  mel_tp.paneTitle = metaguiTpData.paneTitle || mel_tp.paneTitle;
}
if(mel_tp.configPath !== undefined) {
  mel_tp.configOverride = root.assetJson(mel_tp.configPath) as unknown as TeleportConfig;
}

const inactiveColor = "ff0000"; //red
if(player.canDeploy() === false) {
  btnDeploy.color = inactiveColor;
}
btnEdit.color = inactiveColor;

metagui.setTitle(mel_tp.paneTitle);
metagui.setIcon(mel_tp.paneIcon);

/*
  {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
    "icon":"garden",
    "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
    "bookmarkName":"Merchant test"}
*/

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
   //process additional locations from override config
  
  if(finalTpConfig.destinations !== undefined) {
    for(const dest of finalTpConfig.destinations) {
      //Skip unavailable destinations in config
      const destination:Destination = mel_tp_util.JsonToDestination(dest);
      if(destination.prerequisiteQuest !== undefined && player.hasCompletedQuest(destination.prerequisiteQuest) === false) {
        continue; //Quest not complete - skip this Destination
      }
      if(destination.warpAction === WarpAlias.OrbitedWorld) {
        if(player.worldId() !== player.ownShipWorldId()) {
          continue; //disables warping down when not on a PLAYER's ship. TODO: find how to enable on other ships
        }
        const shipLocation: SystemLocationJson = celestial.shipLocation(); 
        const locationType = mel_tp_util.getSpaceLocationType(shipLocation);

        if(locationType === null || shipLocation === null){
          continue; //Warping down is unavailable when location is of unknown type
        }
        if(locationType !== "CelestialCoordinate") {
          //location is not a CelestialCoordinate
          const systemLocations = celestial.systemObjects();
          let maybeUuid;
          if(locationType === "FloatingDungeon"){
            maybeUuid = shipLocation[1] as Uuid;
         }         
          // sb.logWarn(sb.printJson(systemLocations as unknown as JSON))
          // sb.logWarn(sb.print(maybeUuid))
          // sb.logWarn(sb.print(locationType))
          if(maybeUuid === undefined || mel_tp_util.TableContains(systemLocations, maybeUuid) === false || destination.deploy !== true) {
            //location is not FLoatingDungeon OR current system locations have no such Uuid OR deploy is not activated
            continue; //Warping down is available only when orbiting a planet or floating dungeon
          }
        }    
      }

      if(destination.warpAction === WarpAlias.OwnShip && player.worldId() === player.ownShipWorldId()) {
        continue; //If a player is already on their ship - do not offer to warp there even if config lists it
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
        const beamPartyMember = mel_tp.dialogConfig.mel_tp_dialog["beamPartyMemberLabel"];
        const deployPartyMember  = mel_tp.dialogConfig.mel_tp_dialog["deployPartyMemberLabel"];
        const beamPartyMemberIcon = mel_tp.dialogConfig.mel_tp_dialog["beamPartyMemberIcon"];
        const deployPartyMemberIcon = mel_tp.dialogConfig.mel_tp_dialog["deployPartyMemberIcon"];
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
    }
  }


  if(finalTpConfig.includePlayerBookmarks) {
    let filteredBookmarks:TeleportBookmark[]|undefined;
    if(mel_tp.filter === "") {
      filteredBookmarks = mel_tp.bookmarks;
    }
    else {
      filteredBookmarks = mel_tp.bookmarksFiltered;
    }
    if(filteredBookmarks !== undefined) {
      for(const bookmark of filteredBookmarks) {
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
    
        /*
        { "type": "listItem", "children": [
          { "type": "image", "file": ""},
          {"type":"label", "text": "name"},
          {"type": "label", "text": "planet"}
          ],
          "data": {"target": null}
        }
        */
        currentBookmark.children[0].file = bkmData.icon;
        currentBookmark.children[1].text = bkmData.name;
        currentBookmark.children[2].text = bkmData.planetName;
      
        const addedBookmark = bookmarksList.addChild(currentBookmark);
        addedBookmark.onSelected = OnTpTargetSelect;
        addedBookmark.bkmData = bkmData;
      }
    } 
  };
 
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
    
  metagui.queueFrameRedraw()
}

function clearPlanetInfo():void {
  lblBkmName.setText("");
  lblBkmHazards.setText("");
  listHazards.clearChildren();
}

function displayPlanetInfo(coord: CelestialCoordinate):void {
  clearPlanetInfo();
  const dbErrorText = mel_tp.dialogConfig.mel_tp_dialog["CelestialDatabaseError"] || "";
  const name = celestial.planetName(coord);
  const planetParams = celestial.visitableParameters(coord);
  if(name !== null) {
    lblBkmName.setText(name);
  }
  else {
    lblBkmName.setText(dbErrorText);
  }
  if(planetParams !== null) {
    //debug
    // lblBkmHazards.setText("Hazards: "+sb.printJson(planetParams.environmentStatusEffects as unknown as JSON));
    // sb.logInfo("[log] Planet visitable parameters: "..sb.printJson(planetParams as unknown as JSON));
    if(planetParams.environmentStatusEffects.length > 0) {
      //experimental - if at least one hazard is there, show its icon
      const hazardTemplate:hazardItem = listHazards.data;
      for(const effect of planetParams.environmentStatusEffects) {
        if(mel_tp.dialogConfig.planetaryEnvironmentHazards[effect] !== undefined) {
          hazardTemplate.file = mel_tp.dialogConfig.planetaryEnvironmentHazards[effect].icon;
          hazardTemplate.toolTip = mel_tp.dialogConfig.planetaryEnvironmentHazards[effect].displayName;
        } 
        else {
          hazardTemplate.file = mel_tp.dialogConfig.planetaryEnvironmentHazards.error.icon;
          hazardTemplate.toolTip = mel_tp.dialogConfig.planetaryEnvironmentHazards.error.displayName;
        }
        listHazards.addChild(hazardTemplate);
      }
    }
  }
  else {
    lblBkmHazards.setText(world.timeOfDay());
  }
}

function OnTpTargetSelect(bookmarkWidget:any):void {
  mel_tp.selected = bookmarkWidget.bkmData as Destination;
  const dbErrorText = mel_tp.dialogConfig.mel_tp_dialog["CelestialDatabaseError"] || "";
  clearPlanetInfo();
  btnEdit.color = inactiveColor;

  if(typeof mel_tp.selected.warpAction === "string") {
    //destination added from config
    if(mel_tp.selected.warpAction !== WarpAlias.OrbitedWorld) {
      lblBkmName.setText(`Special system alias signature ${sb.printJson(mel_tp.selected.warpAction)}`);
      lblBkmHazards.setText(world.timeOfDay());
    }
    else {
      //Special case for Orbited World: show hazards
      const shipLocation: SystemLocationJson = celestial.shipLocation(); //allow warp only if CelestialCoordinate or FloatingDungeon
      const locationType = mel_tp_util.getSpaceLocationType(shipLocation);

      if(locationType === null || shipLocation === null){
        sb.logError(`Teleport list contains [Orbited World] but ship location is NIL}`);
        return;
      }
      if(locationType !== "CelestialCoordinate") {
        //location is not a CelestialCoordinate
        const systemLocations = celestial.systemObjects();
        let maybeUuid;
        if(locationType === "FloatingDungeon"){
          maybeUuid = shipLocation[1] as Uuid;
        }         

        if(maybeUuid === undefined || mel_tp_util.TableContains(systemLocations, maybeUuid) === false || mel_tp.selected.deploy !== true) {
          //location is not FloatingDungeon OR current system locations have no such Uuid OR deploy is not activated
          sb.logError(`Teleport list contains [Orbited World] but ship location is ${sb.printJson(shipLocation as unknown as JSON)}`)
          return;
        }
      }

      let coord;
      if(locationType === "CelestialCoordinate") {
        coord = shipLocation[1] as CelestialCoordinate;
      }
      
      displayPlanetInfo(coord);
    }
  }
  else if((mel_tp.selected.warpAction as PlayerTarget)[0] === "player") {
    lblBkmName.setText("Player signature");
    lblBkmHazards.setText(world.timeOfDay());
  }
  else if((mel_tp.selected.warpAction as UuidTarget)[0] === "object" ) {
    lblBkmName.setText("Object Uuid signature");
    lblBkmHazards.setText(world.timeOfDay());
  }
  else {
    //Bookmark selected
    btnEdit.color = "accent";
    const warpTarget:WorldIdString = (mel_tp.selected.warpAction as BookmarkTarget)[0];
    const coord:CelestialCoordinate|InstanceWorldId|null = mel_tp_util.WorldIdToObject(warpTarget)
    if(coord === null) {
      lblBkmName.setText(dbErrorText);
      lblBkmHazards.setText(world.timeOfDay());
    }
    else {
      if((coord as CelestialCoordinate).location !== undefined) {
        //TypeGuard: coord is a CelestialCoordinate
        displayPlanetInfo(coord as CelestialCoordinate);
      }
      else {
        //coord is an InstanceWorldId
        const instanceId = coord as InstanceWorldId;
        if(instanceId.instance !== null) {
          lblBkmName.setText(instanceId.instance);
        }
        if(instanceId.level !== "-") {
          lblBkmHazards.setText(`Level ${instanceId.level}`);
        }
      }      
    }
  }

  lblDump.setText(sb.printJson(bookmarkWidget.bkmData));
};

txtboxFilter.onEnter = function ():void {
  mel_tp.filter = txtboxFilter.text;
  if(mel_tp.bookmarks === undefined) {
    return;
  }
  mel_tp.bookmarksFiltered = mel_tp_util.FilterBookmarks(mel_tp.bookmarks, mel_tp.filter)
  populateBookmarks();
  player.say(sb.printJson(txtboxFilter.text))
  // chat.send(sb.printJson(txtboxFilter.text));
}

txtboxFilter.onEscape = function ():void {
  btnResetFilter.onClick();
}

btnResetFilter.onClick = function ():void {
  mel_tp.filter = "";
  txtboxFilter.setText(mel_tp.filter);
  mel_tp.bookmarksFiltered = undefined;
  populateBookmarks();
}

btnSortByPlanet.onClick = function ():void {
  if(mel_tp.bookmarks === undefined) {
    return;
  }
  mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "targetName", false) as unknown as TeleportBookmark[];
  populateBookmarks();
}

btnEdit.onClick = function() {
  if(mel_tp.selected == undefined || typeof mel_tp.selected.warpAction === "string") {
    widget.playSound("/sfx/interface/clickon_error.ogg");
    lblDump.setText("No target selected");
    return;
  }

  widget.playSound("/sfx/interface/ship_confirm1.ogg");
  player.interact("ScriptPane", { gui : {}, scripts : ["/metagui.lua"], ui : "/interface/mel_tp/mel_tp_edit.ui" , data: {}} as unknown as JSON);
}

btnTeleport.onClick = function() {
  if(mel_tp.selected == undefined) {
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump.setText("No target selected")
    return
  }
  // let tempWarpTarget:WarpAction = mel_tp.selected.warpAction;
  const warpTarget:WarpActionString = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)

  lblDump.setText(`Stringified warp target: ${warpTarget}`);
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy || false);
  pane.dismiss();
}

btnDeploy.onClick = function() {
  if(mel_tp.selected == undefined) {
    widget.playSound("/sfx/interface/clickon_error.ogg");
    lblDump.setText("No target selected");
    return;
  }
  if(player.canDeploy() === false) {
    widget.playSound("/sfx/interface/clickon_error.ogg");
    lblDump.setText("No mech to deploy");
    return;
  }

  const warpTarget:WarpActionString = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)
  player.warp(warpTarget, "deploy", true);
  pane.dismiss();
}

btnFallback.onClick = function() {
  activeItem.interact("OpenTeleportDialog", mel_tp.configPath, pane.sourceEntity());
  pane.dismiss();
}

/**
 * Init pane part
 */

if(mel_tp.bookmarks !== undefined) {
  mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "bookmarkName", false) as unknown as TeleportBookmark[];
}
populateBookmarks()

export {
  mel_tp
};

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

