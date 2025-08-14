import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface FootLightProps {
  isConnecting: boolean;
  error: string | null;
  handleSend: (footLightVolume: number) => void;
}

const FootLight: React.FC<FootLightProps> = ({
  isConnecting,
  error,
  handleSend,
}) => {
  const [footLightVolume, setFootLightVolume] = useState(128);
  return (
    <>
      {/* フットライト明度スライダー */}
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
            onChange={(_: Event, value: number) => setFootLightVolume(value)}
            style={{ width: 200 }}
          />
          <TextField
            type="number"
            inputProps={{ min: 0, max: 255 }}
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

export default FootLight;
