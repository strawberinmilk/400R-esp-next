import React, { useState, useEffect } from "react";
import styles from "@/css/components/FootLightMode.module.scss";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { isSetResultResponse } from "@/dto/bluetooth";
import { useSnackBar } from "@/hooks/useSnackBar";

interface PwmLedModeProps {
  bluetoothHook: UseBluetooth;
  ledType: "footLight" | "heartLight";
  label: string;
  mode: string;
}

const PwmLedMode: React.FC<PwmLedModeProps> = ({
  bluetoothHook,
  ledType,
  label,
  mode: modeCommand,
}) => {
  const { showSnackBarWithExitCode } = useSnackBar();
  const { isConnecting, sendBLEData } = bluetoothHook;
  const [mode, setMode] = useState<number>(0);

  // status変更時に初期値反映
  useEffect(() => {
    if (bluetoothHook.status && bluetoothHook.status[ledType]) {
      setMode(bluetoothHook.status[ledType].mode);
    }
  }, [bluetoothHook.status, ledType]);

  // モードリストをstatus.constants[ledType]から動的生成
  const modeList = React.useMemo(() => {
    const constants = bluetoothHook.status?.constants?.[ledType];
    if (!constants || !constants.modeVal || !constants.modeName) return [];
    return constants.modeVal.map((id: number, idx: number) => ({
      id,
      name: constants.modeName[idx] ?? String(id),
    }));
  }, [bluetoothHook.status, ledType]);

  const handleSend = async (selectedMode: number) => {
    const result = await sendBLEData({
      mode: modeCommand,
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
        <InputLabel id={`${ledType}Mode-label`}>{label}</InputLabel>
        <Select
          labelId={`${ledType}Mode-label`}
          id={`${ledType}Mode`}
          value={mode}
          label={label}
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
    </div>
  );
};

export default PwmLedMode;
