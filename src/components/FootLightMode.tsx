import React, { useState, useEffect } from "react";
import styles from "@/css/components/FootLightMode.module.scss";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { isSetResultResponse } from "@/dto/bluetooth";
import { useSnackBar } from "@/hooks/useSnackBar";

interface FootLightModeProps {
  bluetoothHook: UseBluetooth;
}

const FootLightModeComponent: React.FC<FootLightModeProps> = ({
  bluetoothHook,
}) => {
  const { showSnackBarWithExitCode } = useSnackBar();
  const { isConnecting, sendBLEData } = bluetoothHook;
  // modeVal/modeNameはstatus.constants.footLightから取得
  const [mode, setMode] = useState<number>(0);

  // status変更時に初期値反映
  useEffect(() => {
    if (bluetoothHook.status && bluetoothHook.status.footLight) {
      setMode(bluetoothHook.status.footLight.mode);
    }
  }, [bluetoothHook.status]);

  // モードリストをstatus.constants.footLightから動的生成
  const modeList = React.useMemo(() => {
    const constants = bluetoothHook.status?.constants?.footLight;
    if (!constants || !constants.modeVal || !constants.modeName) return [];
    return constants.modeVal.map((id: number, idx: number) => ({
      id,
      name: constants.modeName[idx] ?? String(id),
    }));
  }, [bluetoothHook.status]);

  const handleSend = async (selectedMode: number) => {
    const result = await sendBLEData({
      mode: "footLightMode",
      value: selectedMode,
    });
    if (result && isSetResultResponse(result)) {
      showSnackBarWithExitCode({
        exitCode: result.exitCode,
        message: result.message,
      });
    }
  };

  return (
    <div className={styles.footLightMode}>
      <FormControl size="small" className={styles.formControl}>
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
          disabled={isConnecting || modeList.length === 0}
        >
          {modeList.map((item) => (
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
