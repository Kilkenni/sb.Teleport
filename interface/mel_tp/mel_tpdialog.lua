-- require "/scripts/util.lua"
-- require "/scripts/vec2.lua"

local mel_tp = {}

local function init() 

end

local function updateGui()

end

local function uninit()

end

function btnDumpTp:onClick()
  chat.addMessage("boop")
  lblDebug:setText(sb.printJson(player.teleportBookmarks()))
  sb.logInfo(sb.printJson(player.teleportBookmarks()))
end