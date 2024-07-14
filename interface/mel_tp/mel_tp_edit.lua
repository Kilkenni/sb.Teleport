--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
---@diagnostic disable: undefined-global
require("/interface/mel_tp/mel_tp_util.lua")
require("/scripts/messageutil.lua")

local mel_tp_edit = {
  bookmarkState = {
    target = "Nowhere", 
    targetName = "nowherish", 
    bookmarkName = "Nowhere in particular", 
    icon = "/interface/bookmarks/icons/default.png",
  },
  original = {
    target = "Nowhere", 
    targetName = "nowherish", 
    bookmarkName = "Nowhere in particular", 
    icon = "/interface/bookmarks/icons/default.png"
  },
  locale = nil
}

local function setError(error)
  lblConsole:setText(error)
end

function bkmName:onTextChanged()
  setError("> ")
  mel_tp_edit.bookmarkState.bookmarkName = bkmName.text
  setError(sb.printJson(mel_tp_edit.bookmarkState))
  if mel_tp_edit.bookmarkState.bookmarkName == "" then
    setError("> ^red;Bookmark needs a name!^reset;")
    return
  end
end

function btnEditCancel:onClick()
  pane.dismiss()
end

function btnEditDelete:onClick()
---@diagnostic disable-next-line: undefined-field
  local dialogWindow = mel_tp_util.fillPlaceholdersInPane("/interface/mel_tp/mel_tp_confirm.config:bookmark_delete", mel_tp_edit.locale.mel_tp_confirm)
  promises:add(
    player.confirm(dialogWindow),
    function(choice)
      if choice == true then
        pane.playSound("/sfx/projectiles/electric_barrier_shock_kill.ogg")
        player.removeTeleportBookmark(mel_tp_edit.bookmarkState)
        player.setProperty("mel_tp_repopulate_required", true)
        pane.dismiss()
      else
        return
      end
    end
  )
end

function btnEditSave:onClick()
  if mel_tp_edit.bookmarkState.bookmarkName == "" then
    widget.playSound("/sfx/interface/clickon_error.ogg")
    setError("> ^red;Bookmark needs a name!^reset;")
  end
  if sb.printJson(mel_tp_edit.bookmarkState) == sb.printJson(mel_tp_edit.original) then
    setError("> No changes detected")
    return
  else
    player.removeTeleportBookmark(mel_tp_edit.original)
    pane.playSound("/sfx/interface/ship_confirm1.ogg")
  end
  player.addTeleportBookmark(mel_tp_edit.bookmarkState)
  player.setProperty("mel_tp_repopulate_required", true)
  pane.dismiss()
end

---@diagnostic disable-next-line: lowercase-global
function update(dt)
  promises:update()
end

local function main()
  local mel_tp

  if metagui.inputData == nil then
      pane.dismiss()
      return
  end

  mel_tp = metagui.inputData.mel_tp
  mel_tp_edit.locale = metagui.inputData.localeData

  if mel_tp.selected == nil or mel_tp.bookmarks == nil then
      pane.dismiss()
      return
  end


  mel_tp_edit.bookmarkState.icon = mel_tp.selected.icon
  mel_tp_edit.bookmarkState.targetName = mel_tp.selected.planetName
  mel_tp_edit.bookmarkState.bookmarkName = mel_tp.selected.name
  mel_tp_edit.bookmarkState.target = mel_tp.selected.warpAction
  mel_tp_edit.original.icon = mel_tp.selected.icon
  mel_tp_edit.original.targetName = mel_tp.selected.planetName
  mel_tp_edit.original.bookmarkName = mel_tp.selected.name
  mel_tp_edit.original.target = mel_tp.selected.warpAction
  bkmIcon:setFile(mel_tp_util.getIconFullPath(mel_tp_edit.bookmarkState.icon))
  bkmName:setText(mel_tp_edit.bookmarkState.bookmarkName)
  bkmPlanet:setText(mel_tp_edit.bookmarkState.targetName)
  lblInfo:setText(sb.printJson(mel_tp_edit.bookmarkState.target))
end

main()