import React, { useState, useEffect } from "react";
import styles from "@/css/components/FootLightVolume.module.scss";
import Slider from "@mui/material/Slider";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { isSetResultResponse } from "@/dto/bluetooth";
import { useSnackBar } from "@/hooks/useSnackBar";

interface PwmLedVolumeProps {
  bluetoothHook: UseBluetooth;
  lightType: "footLight" | "heartLight";
  label: string;
  mode: string;
}

const PwmLedVolume: React.FC<PwmLedVolumeProps> = ({
  bluetoothHook,
  lightType,
  label,
  mode,
}) => {
  const { showSnackBarWithExitCode } = useSnackBar();
  const { error, sendBLEData } = bluetoothHook;
  const [volume, setVolume] = useState(255);

  useEffect(() => {
    if (bluetoothHook.status && bluetoothHook.status[lightType]) {
      setVolume(bluetoothHook.status[lightType].volume);
    }
  }, [bluetoothHook.status, lightType]);

  const handleSend = async (volume: number) => {
    const result = await sendBLEData({
      mode: mode,
      value: volume,
    });
    if (result && isSetResultResponse(result)) {
      showSnackBarWithExitCode({
        exitCode: result.exitCode,
        message: result.message,
      });
    }
  };

  return (
    <>
      <div className={styles.footLightVolume}>
        <label htmlFor={`${lightType}Volume`}>
          {label}: {volume}
        </label>
        <div className={styles.sliderRow}>
          <Slider
            id={`${lightType}Volume`}
            value={volume}
            min={0}
            max={255}
            step={1}
            onChange={(_, value) => setVolume(value as number)}
            onChangeCommitted={(_, value) => handleSend(value as number)}
            style={{ width: 200 }}
          />
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

export default PwmLedVolume;
