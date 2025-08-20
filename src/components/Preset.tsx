import React, { useState } from "react";
import Button from "@mui/material/Button";
import { UseBluetooth } from "@/hooks/useBluetooth";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { isGetStatusResponse } from "@/dto/bluetooth";

interface PresetProps {
  bluetoothHook: UseBluetooth;
}

export default function Preset({ bluetoothHook }: PresetProps) {
  const status = bluetoothHook.status;
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [showSaveUI, setShowSaveUI] = useState(false);
  const [savePresetName, setSavePresetName] = useState<string>("");

  if (!status || !status.constants?.preset) return null;
  const presetNameList: string[] = status.constants.preset.presetNameList;
  const currentPreset = status.preset.current;
  const isMatched = status.preset.isMatched;

  const handleChange = async (e: SelectChangeEvent) => {
    const name = e.target.value;
    setSelectedPreset(name);
    await bluetoothHook.sendBLEData({ mode: "presetLoad", presetName: name });
    setTimeout(() => {
      bluetoothHook.sendBLEData({ mode: "getStatus" }).then((res) => {
        if (res && isGetStatusResponse(res)) {
          bluetoothHook.setStatus(res);
        }
      });
    }, 500);
  };

  // プリセット保存UIのハンドラ
  const handleSaveClick = () => {
    setShowSaveUI(true);
    setSavePresetName("");
  };
  const handleSavePresetNameChange = (e: SelectChangeEvent) => {
    setSavePresetName(e.target.value);
  };
  const handleSavePreset = async () => {
    if (!savePresetName) return;
    await bluetoothHook.sendBLEData({
      mode: "presetSave",
      presetName: savePresetName,
    });
    setShowSaveUI(false);
    setTimeout(() => {
      bluetoothHook.sendBLEData({ mode: "getStatus" }).then((res) => {
        if (res && isGetStatusResponse(res)) {
          bluetoothHook.setStatus(res);
        }
      });
    }, 500);
  };
  const handleCancelSave = () => {
    setShowSaveUI(false);
    setSavePresetName("");
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8 }}>
        プリセット状態: {isMatched ? currentPreset : "カスタム状態"}
      </div>
      <FormControl size="small" style={{ minWidth: 180, marginRight: 16 }}>
        <InputLabel id="preset-select-label">プリセット選択</InputLabel>
        <Select
          labelId="preset-select-label"
          value={selectedPreset}
          label="プリセット選択"
          onChange={handleChange}
        >
          {presetNameList.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        size="small"
        onClick={handleSaveClick}
        sx={{ ml: 1 }}
      >
        プリセットとして保存
      </Button>
      {showSaveUI && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 16,
          }}
        >
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel id="preset-save-select-label">
              保存先プリセット
            </InputLabel>
            <Select
              labelId="preset-save-select-label"
              value={savePresetName}
              label="保存先プリセット"
              onChange={handleSavePresetNameChange}
            >
              {presetNameList.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            onClick={handleSavePreset}
            disabled={!savePresetName}
          >
            保存
          </Button>
          <Button variant="text" size="small" onClick={handleCancelSave}>
            キャンセル
          </Button>
        </div>
      )}
    </div>
  );
}
