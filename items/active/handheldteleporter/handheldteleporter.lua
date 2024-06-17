function init()
	activeItem.setArmAngle(-0.5)
	self.active = false
	self.consumed = 0
	self.sound = false
end

function activate(fireMode, shiftHeld)
	if status.resourcePercentage("energy") == 1 then
		self.active = true
	end
end

function update(dt, fireMode, shiftHeld, moves)
	if not self.active then
		if mcontroller.crouching() then
			activeItem.setArmAngle(-0.15)
		else
			activeItem.setArmAngle(-0.5)
		end
	elseif self.active then
		local max = status.resourceMax("energy")
		if self.consumed >= max-1 then
			activeItem.interact("ScriptPane", {gui = {}, scripts = {"/metagui.lua"}, ui = "/interface/mel_tp/mel_tpdialog.ui"}, activeItem.ownerEntityId())
			self.consumed = 0
		end
		if fireMode ~= "primary" or status.resourceLocked("energy") then
			self.active = false
			self.consumed = 0
			animator.stopAllSounds("charging", 0)
			self.sound = false
			animator.setLightActive("chargeGlow", false)
			return
		end
		if not self.sound then
			self.sound = true
			animator.playSound("charging", -1)
		end
		activeItem.setArmAngle(0.1)
		animator.setLightActive("chargeGlow", true)
		local consumeAmount = max/50
		status.overConsumeResource("energy", consumeAmount)
		self.consumed = self.consumed + consumeAmount
		animator.setAnimationState("charging", "active")
	end
end