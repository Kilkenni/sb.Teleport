--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
---@diagnostic disable: undefined-global

local mel_tp_edit = {
  bookmarkState = {
    target = "Nowhere", 
    targetName = "nowherish", 
    bookmarkName = "Nowhere in particular", 
    icon = "/interface/bookmarks/icons/default.png"
  }
}

local function setError(error)
  lblConsole:setText(error)
end

function bkmName:onTextChanged()
  mel_tp_edit.bookmarkState.bookmarkName = bkmName.text
  setError(sb.printJson(mel_tp_edit.bookmarkState))
  if mel_tp_edit.bookmarkState.bookmarkName == "" then
      setError(">Bookmark needs a name!")
  end
end

function btnEditCancel:onClick()
  pane.dismiss()
end

function btnEditDelete:onClick()
  -- widget.playSound("/sfx/interface/clickon_error.ogg")
  sb.logWarn("Trying to delete bookmark...")
  sb.logWarn(sb.print(player.removeTeleportBookmark(mel_tp_edit.bookmarkState)))
end

function btnEditSave:onClick()
  if mel_tp_edit.bookmarkState.bookmarkName == "" then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    setError("> ^red;Bookmark needs a name!^white;")
  end
  -- widget.playSound("/sfx/interface/clickon_error.ogg")
  -- pane.dismiss()
end

local function main()
  local mel_tp

  if metagui.inputData == nil then
      pane.dismiss()
      return
  end

  mel_tp = metagui.inputData.mel_tp

  if mel_tp.selected == nil or mel_tp.bookmarks == nil then
      pane.dismiss()
      return
  end

  
  mel_tp_edit.bookmarkState.icon = mel_tp.selected.icon
  mel_tp_edit.bookmarkState.targetName = mel_tp.selected.planetName
  mel_tp_edit.bookmarkState.bookmarkName = mel_tp.selected.name
  mel_tp_edit.bookmarkState.target = mel_tp.selected.warpAction
  bkmIcon:setFile(mel_tp_edit.bookmarkState.icon)
  bkmName:setText(mel_tp_edit.bookmarkState.bookmarkName)
  bkmPlanet:setText(mel_tp_edit.bookmarkState.targetName)
  lblInfo:setText(sb.printJson(mel_tp_edit.bookmarkState.target))
end

main()