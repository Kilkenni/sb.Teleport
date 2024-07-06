--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
--[[local ____mel_tp_dialog = --require("/interface/mel_tp/mel_tp_dialog.lua") --]]
-- local mel_tp = ____mel_tp_dialog.mel_tp

local mel_tp

if(metagui.inputData == nil) then
  pane.dismiss()
  return
else
  if(metagui.inputData ~= nil) then
    mel_tp = metagui.inputData.mel_tp
  end
end
 

if mel_tp.selected == nil then
    pane.dismiss()
end
local mel_tp_edit = {
  bookmarkState = {
    target = "Nowhere", 
    targetName = "nowherish", 
    bookmarkName = "Nowhere in particular", 
    icon = "/interface/bookmarks/icons/default.png"
  }
}

bkmIcon:setFile(mel_tp_edit.bookmarkState.icon)
bkmName:setText(mel_tp_edit.bookmarkState.bookmarkName)
bkmPlanet:setText(mel_tp_edit.bookmarkState.targetName)
lblDump:setText(sb.printJson(mel_tp_edit.bookmarkState.target))

function btnEditCancel:onClick()
    widget.playSound("/sfx/interface/clickon_error.ogg")
    pane.dismiss()
end

function btnEditDelete:onClick()
    widget.playSound("/sfx/interface/clickon_error.ogg")
end

function btnEditSave:onClick()
    widget.playSound("/sfx/interface/clickon_error.ogg")
    pane.dismiss()
end