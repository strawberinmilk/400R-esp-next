import React, { useState } from "react";
import { UseBluetooth } from "@/hooks/useBluetooth";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface PresetProps {
  bluetoothHook: UseBluetooth;
}

export default function Preset({ bluetoothHook }: PresetProps) {
  const status = bluetoothHook.status;
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  if (!status || !status.constants?.preset) return null;
  const presetNameList: string[] = status.constants.preset.presetNameList;
  const currentPreset = status.preset.current;
  const isMatched = status.preset.isMatched;

  const handleChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
    const name = e.target.value as string;
    setSelectedPreset(name);
    await bluetoothHook.sendBLEData({ mode: "presetLoad", presetName: name });
    setTimeout(() => {
      bluetoothHook.sendBLEData({ mode: "getStatus" }).then((res) => {
        if (res && res.type === "status") {
          bluetoothHook.setStatus(res);
        }
      });
    }, 500);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8 }}>
        プリセット状態: {isMatched ? currentPreset : "カスタム状態"}
      </div>
      <FormControl size="small" style={{ minWidth: 180 }}>
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
    </div>
  );
}
