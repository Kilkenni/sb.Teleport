/**
 * This module handles main Teleport ScriptPane constructed with MetaGUI
 */
import { metagui } from "../../@types-mods/stardust_metagui.lua";
declare const bookmarksList:metagui.ScrollArea;
declare const txtboxFilter: metagui.TextBox;
declare const btnResetFilter: metagui.Button;
declare const btnSortByPlanet: metagui.Button;
declare const btnEdit: metagui.Button;
declare const btnFallback: metagui.Button;
declare const btnTeleport: metagui.Button;
declare const btnDeploy: metagui.Button;
declare const lblBkmName: metagui.Label;
declare const lblBkmHazards: metagui.Label;
declare const lblDump: metagui.Label;
declare const listHazards: metagui.Layout;
declare interface tpItem {
  type: "listItem",
  children: [
    {type: "image", file: string},
    {type: "label", text: string},
    {type: "label", text: string},
],
  data: {target:string}
}
declare interface hazardItem extends metagui.Image {}
declare const lblVersion:metagui.Label;

import mel_tp_util from "./mel_tp_util";

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
  dialogConfig: TpDialogConfig,
  version: string
} = {
  paneIcon: "/interface/warping/icon.png", //default values
  paneTitle: "Teleporter",
  bookmarks: undefined,
  filter: "",
  bookmarksFiltered: undefined,
  bookmarkTemplate: bookmarksList.data as unknown as tpItem,
  configPath: "",
  configOverride: undefined,
  selected: undefined,
  animation: "default",
  dialogConfig: root.assetJson("/interface/mel_tp/mel_tp.config") as unknown as TpDialogConfig,
  version: "SparkTpTec v: unknown"
};
const inactiveColor = "ff0000"; //red

function refreshBookmarks():void {
  mel_tp.bookmarks = player.teleportBookmarks() as TeleportBookmark[];
}

function populateBookmarks() {
  bookmarksList.clearChildren()

  //default values
  const finalTpConfig:TeleportConfig = {
    canBookmark : false,
    bookmarkName : "",
    canTeleport : true,
    includePartyMembers : false,
    includePlayerBookmarks : false,
    destinations : undefined, //array of additional destinations
  };

  if(mel_tp.configOverride !== undefined) {
    finalTpConfig.canBookmark = mel_tp.configOverride.canBookmark || finalTpConfig.canBookmark;
    finalTpConfig.bookmarkName = mel_tp.configOverride.bookmarkName || finalTpConfig.bookmarkName;
    finalTpConfig.canTeleport = mel_tp.configOverride.canTeleport || finalTpConfig.canTeleport;
    finalTpConfig.includePartyMembers = mel_tp.configOverride.includePartyMembers || finalTpConfig.includePartyMembers;
    finalTpConfig.includePlayerBookmarks = mel_tp.configOverride.includePlayerBookmarks || finalTpConfig.includePlayerBookmarks;
    finalTpConfig.destinations = mel_tp.configOverride.destinations || finalTpConfig.destinations;
  }

  //ADD BOOKMARK OPTION
  if(finalTpConfig.canBookmark === true) {
    const entityConfig = root.itemConfig({
      name: world.getObjectParameter(pane.sourceEntity(), "objectName") as unknown as string,
      count: 1 as unsigned,
      parameters: {} as unknown as JSON
    });
    let uniqueId:string = "";
    if(entityConfig !== null) {
      uniqueId = world.entityUniqueId(pane.sourceEntity())
    }
    if(uniqueId !== "") {
      //sourceEntity is an object AND has config AND UniqueId - the latter is the teleporter ID.
      const worldId: WorldIdString = player.worldId();
      const destination: Destination = {
        icon: "default",
        name: finalTpConfig.bookmarkName as string,
        planetName: "???",
        warpAction: [
          worldId as WorldIdString,
          uniqueId as SpawnTarget
        ] as BookmarkTarget
      }

      //TODO FIXME - + don't forget to disable current location in bookmarks for teleportation, if saved

      if(mel_tp_util.IsBookmarkShip(destination.warpAction as BookmarkTarget)) {
        /* BookmarkTarget is ClientShipWorldId */
        destination.icon = "ship";
        destination.planetName = "Player Ship";
      }
      else if (mel_tp_util.IsBookmarkPlanet(destination.warpAction as BookmarkTarget)) {
        /* BookmarkTarget is CelestialWorldId */
        const planetWorldIdString = worldId as CelestialWorldIdString;
        destination.icon = world.type()||"default", //typeName of main planetary biome
        destination.planetName = celestial.planetName(mel_tp_util.WorldIdToObject(planetWorldIdString) as CelestialCoordinate) as string; //worldName of planet
      }
      else if(mel_tp_util.IsBookmarkInstance(destination.warpAction as BookmarkTarget)) {
        /* BookmarkTarget is InstanceWorldId */
        const instanceWorldIdString = worldId as InstanceWorldIdString;
        const instanceWorldId: InstanceWorldId = mel_tp_util.WorldIdToObject(instanceWorldIdString) as InstanceWorldId;
        destination.icon = world.type()||"default", //typeName of instance
        destination.planetName = instanceWorldId.instance //worldName of instance
      }

      const currentLocBookmarked = util.find(mel_tp.bookmarks as TeleportBookmark[], function(bkm: TeleportBookmark) {
        return mel_tp_util.TargetToWarpCommand(bkm.target) === mel_tp_util.TargetToWarpCommand(destination.warpAction);
      }) 
      if(currentLocBookmarked === null || finalTpConfig.canTeleport === false) {
        /* If current location is not saved to bookmarks OR it can only serve as destination for Tp - offer to save it */
        //open add new bookmark with <destination> as a bookmark
      const currentBookmark = mel_tp.bookmarkTemplate as tpItem;
      currentBookmark.children[0].file = mel_tp_util.getIconFullPath(destination.icon);
      currentBookmark.children[1].text = destination.name;
      currentBookmark.children[2].text = destination.planetName;
      const addedBookmark = bookmarksList.addChild(currentBookmark as unknown as metagui.widget);
      addedBookmark["onSelected"] = undefined; //OnTpTargetSelect; //FIXME - temp disable select for current location
      addedBookmark["bkmData"] = destination;
      }
    }
  }

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
        icon: destination.icon,
        deploy: destination.deploy || false, //Deploy mech. Default: false
        mission: destination.mission || false, //Default: false
        prerequisiteQuest: destination.prerequisiteQuest || false, //if the player has not completed the quest, destination is not available
      };
      
      const currentBookmark = mel_tp.bookmarkTemplate as tpItem;
      currentBookmark.children[0].file = mel_tp_util.getIconFullPath(bkmData.icon);
      currentBookmark.children[1].text = bkmData.name;
      currentBookmark.children[2].text = bkmData.planetName;
      const addedBookmark = bookmarksList.addChild(currentBookmark as unknown as metagui.widget);
      addedBookmark["onSelected"] = OnTpTargetSelect;
      addedBookmark["bkmData"] = bkmData;
    }
  }

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
        const bkmData: Destination = {
          //system = false //for special locations like ship etc
          warpAction: bookmark.target as BookmarkTarget, //warp coords or command
          name: bookmark.bookmarkName || "???", //default: ???
          planetName: bookmark.targetName || "", //default: empty string
          icon: bookmark.icon,
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
        const currentBookmark = mel_tp.bookmarkTemplate as tpItem;
        currentBookmark.children[0].file = mel_tp_util.getIconFullPath(bkmData.icon);
        currentBookmark.children[1].text = bkmData.name;
        currentBookmark.children[2].text = bkmData.planetName;
      
        const addedBookmark = bookmarksList.addChild(currentBookmark as unknown as metagui.widget);
        addedBookmark["onSelected"] = OnTpTargetSelect;
        addedBookmark["bkmData"] = bkmData;
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
      const hazardTemplate:hazardItem = listHazards.data as unknown as hazardItem;
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
    lblBkmHazards.setText(world.timeOfDay().toString());
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
      lblBkmName.setText(`Special system alias signature ${sb.printJson(mel_tp.selected.warpAction as unknown as JSON)}`);
      lblBkmHazards.setText(world.timeOfDay().toString());
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
    lblBkmHazards.setText(world.timeOfDay().toString());
  }
  else if((mel_tp.selected.warpAction as UuidTarget)[0] === "object" ) {
    lblBkmName.setText("Object Uuid signature");
    lblBkmHazards.setText(world.timeOfDay().toString());
  }
  else {
    //Bookmark selected
    btnEdit.color = "accent";
    const warpTarget:WorldIdString = (mel_tp.selected.warpAction as BookmarkTarget)[0];
    const coord:CelestialCoordinate|InstanceWorldId|null = mel_tp_util.WorldIdToObject(warpTarget)
    if(coord === null) {
      lblBkmName.setText(dbErrorText);
      lblBkmHazards.setText(world.timeOfDay().toString());
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

  player.interact("ScriptPane", { gui : {}, scripts : ["/metagui.lua"], ui : "/interface/mel_tp/mel_tp_edit.ui" , data: {mel_tp: mel_tp, localeData: mel_tp.dialogConfig.mel_tp_edit}} as unknown as JSON);
}

btnTeleport.onClick = function():void {
  if(mel_tp.selected == undefined) {
    widget.playSound("/sfx/interface/clickon_error.ogg")  
    lblDump.setText("No target selected")
    return;
  }
  // let tempWarpTarget:WarpAction = mel_tp.selected.warpAction;
  const warpTarget:WarpActionString = mel_tp_util.TargetToWarpCommand(mel_tp.selected.warpAction)

  lblDump.setText(`Stringified warp target: ${warpTarget}`);
  player.warp(warpTarget, mel_tp.animation, mel_tp.selected.deploy || false);
  pane.dismiss();
}

btnDeploy.onClick = function():void {
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

btnFallback.onClick = function():void {
  player.interact("OpenTeleportDialog", mel_tp.configPath, pane.sourceEntity());
  pane.dismiss();
}

function main(this:void):void {
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

  if(player.canDeploy() === false) {
    btnDeploy.color = inactiveColor;
  }
  

  /*
    {"targetName":"Larkheed Veil ^green;II^white; ^white;- ^yellow;b^white;",
      "icon":"garden",
      "target":["CelestialWorld:479421145:-426689872:-96867506:7:3","5dc0465b72cf67e42a88fdcb0aeeba5a"],
      "bookmarkName":"Merchant test"}
  */  

  /**
   * Init pane part
  */

  btnEdit.color = inactiveColor;

  metagui.setTitle(mel_tp.paneTitle);
  metagui.setIcon(mel_tp.paneIcon);

  if(mel_tp.bookmarks !== undefined) {
    mel_tp.bookmarks = mel_tp_util.sortArrayByProperty(mel_tp.bookmarks, "bookmarkName", false) as unknown as TeleportBookmark[];
  }
  refreshBookmarks();
  populateBookmarks();

  //OpenStarbound guard
  if(root.assetSourcePaths !== null) {
    const assetsWithMetadata = root.assetSourcePaths(true) as {[assetName:string]: any}
    for(const modPath in assetsWithMetadata) {
      const modName = "sb.Teleport";
      if(assetsWithMetadata[modPath].name === modName) {
        mel_tp.version = "SparkTpTec v: " + assetsWithMetadata[modPath].version;
      }
    }
  }
  lblVersion.setText(mel_tp.version);
}

main();