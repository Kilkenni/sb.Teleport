//manages edit dialog for a bookmark

//declare for interface
declare const btnEditCancel:metagui.Button, btnEditDelete:metagui.Button, btnEditSave:metagui.Button, bkmIcon:metagui.Image, bkmName: metagui.TextBox, bkmPlanet: metagui.Label, lblInfo:metagui.Label, lblConsole: metagui.Label;
declare const promises: any;

// import * as mel_tp_util from "./mel_tp_util";

const mel_tp_edit:{
  bookmarkState:TeleportBookmark,
} = {
  bookmarkState: {
    target: "Nowhere" as unknown as BookmarkTarget,
    targetName: "nowherish", //planetName
    bookmarkName: "Nowhere in particular",
    icon: "/interface/bookmarks/icons/default.png"
  }
}
main();

function main():void {
  let mel_tp: {
    bookmarks: TeleportBookmark[]|undefined,
    selected: Destination|undefined,
    };
    
    if(metagui.inputData === undefined) {
      pane.dismiss();
      return;
    }
    
    mel_tp = metagui.inputData.mel_tp as {
      bookmarks: TeleportBookmark[]|undefined,
      selected: Destination|undefined,
    }
    
    //some bookmark should be selected fo edit to work
    if(mel_tp.selected === undefined || mel_tp.bookmarks === undefined) {
      pane.dismiss();
      return;
    }
    
    mel_tp_edit.bookmarkState.icon =  mel_tp.selected.icon;
    mel_tp_edit.bookmarkState.targetName = mel_tp.selected.planetName;
    mel_tp_edit.bookmarkState.bookmarkName = mel_tp.selected.name;
    mel_tp_edit.bookmarkState.target = mel_tp.selected.warpAction as BookmarkTarget;
    //INIT
    bkmIcon.setFile(mel_tp_edit.bookmarkState.icon);
    bkmName.setText(mel_tp_edit.bookmarkState.bookmarkName);
    bkmPlanet.setText(mel_tp_edit.bookmarkState.targetName);
    lblInfo.setText(sb.printJson(mel_tp_edit.bookmarkState.target as unknown as JSON));
}

bkmName.onTextChanged = function() {
  mel_tp_edit.bookmarkState.bookmarkName = bkmName.text;
  if(mel_tp_edit.bookmarkState.bookmarkName === "") {
    setError("> Bookmark needs a name!");
  }
}

function setError(error: string):void {
  lblConsole.setText(error);
}

btnEditCancel.onClick = function() {
  pane.dismiss()
}

btnEditDelete.onClick = function() {
  // const modgun = someItem
	// const dialogWindow = Ra_DialogLib.fillPlaceholdersInDialogWindow("/interface/confirmation/reassemblerconfirm.config:gun_reset", modgun)
  const dialogWindow = "/interface/mel_tp/mel_tp_confirm.config:bookmark_delete"

  
	promises.add(player.confirm(dialogWindow), function(choice:boolean) {
		if(choice === true) {
			sb.logWarn("[HELP] CONFIRMATION: YES")
			// world.sendEntityMessage(pane.containerEntityId(), "resetGun")
			widget.playSound("/sfx/objects/cropshipper_box_lock3.ogg")
    }
		else {
			sb.logWarn("[HELP] CONFIRMATION: NO")
    }
	})
	widget.playSound("/sfx/interface/ship_confirm1.ogg")
  sb.logWarn("Trying to delete bookmark...")
  sb.logWarn(sb.print(player.removeTeleportBookmark(mel_tp_edit.bookmarkState)));
}

btnEditSave.onClick = function() {
  if(mel_tp_edit.bookmarkState.bookmarkName === "") {
    widget.playSound("/sfx/interface/clickon_error.ogg");
    setError(">Bookmark needs a name!");
  }

  //TODO

  /*
    if (!m_isNew)
      m_playerUniverseMap->removeTeleportBookmark(m_bookmark);
    m_playerUniverseMap->addTeleportBookmark(m_bookmark);
  */
  //player.removeTeleportBookmark();
  

  // widget.playSound("/sfx/interface/clickon_error.ogg");
  // pane.dismiss()
}


/*
namespace Star {

STAR_CLASS(EditBookmarkDialog);

class EditBookmarkDialog : public Pane {
public:
  EditBookmarkDialog(PlayerUniverseMapPtr playerUniverseMap);

  virtual void show() override;

  void setBookmark(TeleportBookmark bookmark);

  void ok();
  void remove();
  void close();

private:
  PlayerUniverseMapPtr m_playerUniverseMap;
  TeleportBookmark m_bookmark;

  bool m_isNew;
};




namespace Star {

void EditBookmarkDialog::setBookmark(TeleportBookmark bookmark) {
  m_bookmark = bookmark;

  m_isNew = true;
  for (auto& existing : m_playerUniverseMap->teleportBookmarks()) {
    if (existing == bookmark) {
      m_bookmark.bookmarkName = existing.bookmarkName;
      m_isNew = false;
    }
  }
}

void EditBookmarkDialog::show() {
  Pane::show();

  if (m_isNew) {
    fetchChild<LabelWidget>("lblTitle")->setText("NEW BOOKMARK");
    fetchChild<ButtonWidget>("remove")->hide();
  } else {
    fetchChild<LabelWidget>("lblTitle")->setText("EDIT BOOKMARK");
    fetchChild<ButtonWidget>("remove")->show();
  }

  auto assets = Root::singleton().assets();
  fetchChild<ImageWidget>("imgIcon")->setImage(strf("/interface/bookmarks/icons/{}.png", m_bookmark.icon));

  fetchChild<LabelWidget>("lblPlanetName")->setText(m_bookmark.targetName);
  fetchChild<TextBoxWidget>("name")->setText(m_bookmark.bookmarkName, false);
  fetchChild<TextBoxWidget>("name")->focus();
}

void EditBookmarkDialog::ok() {
  m_bookmark.bookmarkName = fetchChild<TextBoxWidget>("name")->getText();
  if (m_bookmark.bookmarkName.empty())
    m_bookmark.bookmarkName = m_bookmark.targetName;
  if (!m_isNew)
    m_playerUniverseMap->removeTeleportBookmark(m_bookmark);
  m_playerUniverseMap->addTeleportBookmark(m_bookmark);
  dismiss();
}

void EditBookmarkDialog::remove() {
  m_playerUniverseMap->removeTeleportBookmark(m_bookmark);
  dismiss();
}

}
*/