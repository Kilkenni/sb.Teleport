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

_ASYNC = {
  promises = {},
  length = 0,
  add = function(promise, callback)
    _ASYNC.promises[tostring(_ASYNC.length)] = {promise = promise, callback = callback}
    _ASYNC.length = _ASYNC.length + 1
  end,
  update = function()
    for index in pairs(_ASYNC.promises) do
      local prom = _ASYNC.promises[index]
      if prom ~= nil then
        if prom ~= nil and prom.promise:succeeded() == true then
            prom.callback(prom.promise:result())
            _ASYNC.promises[index] = nil
        end
      end
    end
  end
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
  local dialogWindow = "/interface/mel_tp/mel_tp_confirm.config:bookmark_delete"
  _ASYNC.add(
    player.confirm(dialogWindow),
    function(choice)
      if choice == true then
        pane.playSound("/sfx/projectiles/electric_barrier_shock_kill.ogg")
        player.removeTeleportBookmark(mel_tp_edit.bookmarkState)
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
  -- widget.playSound("/sfx/interface/clickon_error.ogg")
  -- pane.dismiss()
end

---@diagnostic disable-next-line: lowercase-global
function update(dt)
  _ASYNC.update()
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