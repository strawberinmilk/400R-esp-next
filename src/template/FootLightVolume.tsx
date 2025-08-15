import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { useGlobalSnackbar } from "@/util/GlobalSnackbar";

interface FootLightProps {
  bluetoothHook: UseBluetooth;
}

const FootLightVolume: React.FC<FootLightProps> = ({ bluetoothHook }) => {
  const { showSnackbar } = useGlobalSnackbar();
  const { isConnecting, error, sendBLEData } = bluetoothHook;
  const [footLightVolume, setFootLightVolume] = useState(128);

  async function handleSend(footLightVolume: number) {
    const success = await sendBLEData({
      mode: "footLightVol",
      value: footLightVolume,
    });
    if (success) showSnackbar("送信しました");
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="footLightVolume">
          フットライト明度: {footLightVolume}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
          <TextField
            type="number"
            value={footLightVolume}
            onChange={(e) => {
              let v = Number(e.target.value);
              if (isNaN(v)) v = 0;
              if (v < 0) v = 0;
              if (v > 255) v = 255;
              setFootLightVolume(v);
            }}
            size="small"
            style={{ width: 80 }}
            inputProps={{ min: 0, max: 255 }}
          />
        </div>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSend(footLightVolume)}
        disabled={isConnecting}
        sx={{ mt: 3 }}
      >
        {isConnecting ? "接続中..." : "BLEで送信"}
      </Button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </>
  );
};

export default FootLightVolume;
