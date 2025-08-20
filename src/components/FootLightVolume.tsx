import React, { useState, useEffect } from "react";
import styles from "@/css/components/FootLightVolume.module.scss";
import Slider from "@mui/material/Slider";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { isSetResultResponse } from "@/dto/bluetooth";
import { useSnackBar } from "@/hooks/useSnackBar";

interface FootLightProps {
  bluetoothHook: UseBluetooth;
}

const FootLightVolume: React.FC<FootLightProps> = ({ bluetoothHook }) => {
  const { showSnackBarWithExitCode } = useSnackBar();
  const { error, sendBLEData } = bluetoothHook;
  const [footLightVolume, setFootLightVolume] = useState(255);

  useEffect(() => {
    if (bluetoothHook.status && bluetoothHook.status.footLight) {
      setFootLightVolume(bluetoothHook.status.footLight.volume);
    }
  }, [bluetoothHook.status]);

  const handleSend = async (footLightVolume: number) => {
    const result = await sendBLEData({
      mode: "footLightVol",
      value: footLightVolume,
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
        <label htmlFor="footLightVolume">
          フットライト明度: {footLightVolume}
        </label>
        <div className={styles.sliderRow}>
          <Slider
            id="footLightVolume"
            value={footLightVolume}
            min={0}
            max={255}
            step={1}
            onChange={(_, value) => setFootLightVolume(value as number)}
            onChangeCommitted={(_, value) => handleSend(value as number)}
            style={{ width: 200 }}
          />
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

export default FootLightVolume;
