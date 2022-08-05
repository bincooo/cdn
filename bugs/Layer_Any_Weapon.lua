log.info("[Layer Any Weapon] started loading")

local configPath = "Layer_Any_Weapon_Config.json"

local config = {
	savedWeaponLayers = {

	},
	filterSlotsByType = true
}

if json ~= nil then
    local file = json.load_file(configPath)
    if file ~= nil then
		config = file
    else
        json.dump_file(configPath, config)
    end
end

sdk.hook(sdk.find_type_definition("snow.gui.fsm.smithy.GuiHyakuryuProcess"):get_method("setEquipBoxFilter"),
function(args)
	if sdk.to_int64(args[3]) == 262144 then
		sdk.to_managed_object(args[2]):call("setEquipBoxFilter", 16383)
		return sdk.PreHookResult.SKIP_ORIGINAL
	end
end,
function(retval)
	return retval
end
);

--[[font = imgui.load_font("msyh.ttc", 15, {0x1, 0xFFFF, 0})
re.on_draw_ui(function()
	imgui.push_font(font)
	if imgui.button("幻化任意武器") then
		drawLayerWeaponOptionsWindow = true
	end
	
    if drawLayerWeaponOptionsWindow then
        if imgui.begin_window("Layer Any Weapon", true, 64) then
			local doWrite = false
			local EquipDataManager = sdk.get_managed_singleton("snow.data.EquipDataManager")
			local HeldWeapon = EquipDataManager:get_field("_PlEquipPack"):get_field("<InventoryDataList>k__BackingField")[0]
			local HeldWeaponData = nil
			local HeldWeaponType = nil
			local filterSlotsByType = true
			if HeldWeapon then
				if HeldWeapon:get_field("_IdType")==1 then
					HeldWeaponData = sdk.to_managed_object(HeldWeapon:call("getWeaponData"))
				end
			end
			
			if HeldWeaponData then
				HeldWeaponType = HeldWeaponData:call("getWeaponType")
				imgui.text("装备的武器： "..HeldWeaponData:call("get_Name"))
				local currentLayer = HeldWeapon:call("get_HyakuryuModelId")
				if currentLayer==1048576 or currentLayer==HeldWeaponData:call("getModelId") then
					imgui.text("幻化状态： 关闭")
				else
					imgui.text("幻化状态： 开启")
				end
			else
				imgui.text("装备的武器： 无或不可读")
			end
			
			if imgui.button("重置持有的武器模型") then
				if HeldWeaponData then
					HeldWeapon:call("set_HyakuryuModelId", 1048576)
				end
			end
			imgui.same_line()
			imgui.text("The Smithy will recongnize that the weapon has no Layered data")
			if imgui.button("保存持有的武器到图层槽") then
				if HeldWeaponData then
					local newLayer = {modelId = tostring(HeldWeaponData:call("getModelId")), name = HeldWeaponData:call("get_Name"), weaponType = tostring(HeldWeaponData:call("getWeaponType"))}
					if config.savedWeaponLayers then
						table.insert(config.savedWeaponLayers, newLayer)
					else
						config.savedWeaponLayers = {newLayer}
					end
					doWrite = true
				end
			end
			imgui.same_line()
			imgui.text("Saves the weapon's true form, not any applied Layer")
			imgui.new_line()
			imgui.text("Saved Weapon Layer Slots: Changes will be applied when model is next loaded")
			
			changed, value = imgui.checkbox('根据武器类型进行过滤', config.filterSlotsByType)
			if changed then
				config.filterSlotsByType = value
				doWrite = true
			end
			
			if config.savedWeaponLayers then 
				for i,savedLayer in ipairs(config.savedWeaponLayers) do
					if (not config.filterSlotsByType or HeldWeaponType==tonumber(savedLayer.weaponType)) then
						if imgui.button("应用到武器##Slot"..tostring(i)) then
							if HeldWeaponData then
								HeldWeapon:call("set_HyakuryuModelId", tonumber(savedLayer.modelId))
							end
						end
						imgui.same_line()
						if imgui.button("清理图层槽##Slot"..tostring(i)) then
							table.remove(config.savedWeaponLayers, i)
							doWrite = true
						end
						imgui.same_line()
						imgui.text("  Slot "..tostring(i).." - "..savedLayer.name)
					end
				end
			end
			
			if doWrite then
				json.dump_file(configPath, config)
			end
			imgui.end_window()
        else
            drawLayerWeaponOptionsWindow = false
        end
    end
end)
log.info("[Layer Any Weapon] finished loading")]]





-----------------------------------------------------------------------------------------------
function IsModuleAvailable(name)
  if package.loaded[name] then
    return true
  else
    for _, searcher in ipairs(package.searchers or package.loaders) do
      local loader = searcher(name)
      if type(loader) == 'function' then
        package.preload[name] = loader
        return true
      end
    end
    return false
  end
end


local modUI = nil
local apiPackageName = "ModOptionsMenu.ModMenuApi"
if IsModuleAvailable(apiPackageName) then
    modUI = require(apiPackageName)
end


if not modUI then
    return
end

local function SaveSettings()
	json.dump_file(configPath, config)
end

local currSavedLayer, currIdx = nil, 0
local drawLayerWeaponOptionsWindow = false
modUI.OnMenu("<COL>武器幻化</COL>", "幻化任意武器设置", function()
	local EquipDataManager = sdk.get_managed_singleton("snow.data.EquipDataManager")
	if not EquipDataManager then
		modUI.Header("... 正在初始化 ...")
		return
	end
	local HeldWeapon = EquipDataManager:get_field("_PlEquipPack"):get_field("<InventoryDataList>k__BackingField")[0]
	local HeldWeaponData = nil
	local HeldWeaponType = nil
	local filterSlotsByType = true
	if HeldWeapon then
		if HeldWeapon:get_field("_IdType") == 1 then
			HeldWeaponData = sdk.to_managed_object(HeldWeapon:call("getWeaponData"))
		end
	end


	local saver = false
	if not drawLayerWeaponOptionsWindow then
		if HeldWeaponData then
			HeldWeaponType = HeldWeaponData:call("getWeaponType")
			modUI.Header("当前装备的武器： "..HeldWeaponData:call("get_Name"))
			local currentLayer = HeldWeapon:call("get_HyakuryuModelId")
			if currentLayer==1048576 or currentLayer == HeldWeaponData:call("getModelId") then
				modUI.Label("幻化状态： ", "关闭", "当前未开启幻化.")
			else
				modUI.Label("幻化状态： ", "开启", "当前已开启幻化.")
			end
		else
			modUI.Label("装备的武器： ", "无或不可读", "未读取到当前装备的武器.")
		end

		if modUI.Button("重置持有的武器模型", nil, false, "将还原持有的武器至最初的模型.") then
			if HeldWeaponData then
				HeldWeapon:call("set_HyakuryuModelId", 1048576)
				modUI.Repaint()
			end
		end

		modUI.Header("铁匠处可使用所有武器的幻化功能 (<COL RED>仅限本体武器</COL>)")
		if modUI.Button("保存持有的武器到图层槽") then
			if HeldWeaponData then
				local newLayer = {modelId = tostring(HeldWeaponData:call("getModelId")), name = HeldWeaponData:call("get_Name"), weaponType = tostring(HeldWeaponData:call("getWeaponType"))}
				if config.savedWeaponLayers then
					table.insert(config.savedWeaponLayers, newLayer)
				else
					config.savedWeaponLayers = {newLayer}
				end
				saver = true
			end
		end

		changed, value = modUI.Toggle("武器过滤", config.filterSlotsByType, "根据武器类型进行过滤.")
		if changed then
			config.filterSlotsByType = value
			saver = true
		end

		if config.savedWeaponLayers then 
			for i,savedLayer in ipairs(config.savedWeaponLayers) do
				if (not config.filterSlotsByType or HeldWeaponType == tonumber(savedLayer.weaponType)) then
					if modUI.Button("SLOT ## <COL YEL>"..savedLayer.name.."</COL>", nil, false, "武器槽<COL YEL>"..savedLayer.name.."</COL>的<COL RED>应用与删除</COL>操作.") then
						drawLayerWeaponOptionsWindow = true
						currSavedLayer = savedLayer
						currIdx = i
						modUI.Repaint()
						return
					end
				end
			end
		end
	-- 武器槽编辑窗口 -----------------
	else
		local goback = false
		modUI.Header("SLOT ## <COL YEL>"..currSavedLayer.name.."</COL>")
		if modUI.Button("应用模型", nil, false, "修改当前武器的模型.") then
			if HeldWeaponData then
				HeldWeapon:call("set_HyakuryuModelId", tonumber(currSavedLayer.modelId))
				saver = true
			end
			goback = true
		end
		if modUI.Button("清理模型", nil, false, "删除武器模型<COL YEL>"..currSavedLayer.name.."</COL>.") then
			table.remove(config.savedWeaponLayers, currIdx)
			saver = true
			goback = true
		end
		if modUI.Button("返回上一步", nil, false, "") then
			goback = true
		end
		if goback then
			drawLayerWeaponOptionsWindow = false
			modUI.Repaint()
		end
	end

	if saver then SaveSettings() end
end)


re.on_config_save(function()
	SaveSettings()
end)