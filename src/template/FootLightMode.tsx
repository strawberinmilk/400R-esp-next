import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { useGlobalSnackbar } from "@/util/GlobalSnackbar";
import { FootLightModeList } from "@/constants/matchToEsp";

// 選択肢はmatchToEsp.tsから取得

interface FootLightModeProps {
  bluetoothHook: UseBluetooth;
}

const FootLightModeComponent: React.FC<FootLightModeProps> = ({
  bluetoothHook,
}) => {
  const { showSnackbar } = useGlobalSnackbar();
  const { isConnecting, sendBLEData } = bluetoothHook;
  const [mode, setMode] = useState<number>(FootLightModeList[0].id);

  async function handleSend(selectedMode: number) {
    const success = await sendBLEData({
      mode: "footLightMode",
      value: selectedMode,
    });
    if (success) showSnackbar("送信しました");
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <FormControl size="small" style={{ minWidth: 200 }}>
        <InputLabel id="footLightMode-label">フットライトモード</InputLabel>
        <Select
          labelId="footLightMode-label"
          id="footLightMode"
          value={mode}
          label="フットライトモード"
          onChange={async (e) => {
            const selected = Number(e.target.value);
            setMode(selected);
            await handleSend(selected);
          }}
          disabled={isConnecting}
        >
          {FootLightModeList.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* ボタン削除: 選択時に即送信 */}
    </div>
  );
};

export default FootLightModeComponent;
