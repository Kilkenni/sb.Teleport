-- Add object patches
local objects = assets.byExtension("object")
local path = "/objects/mel_tp.patch"
for i = 1, #objects do
  assets.patch(objects[i], path)
end