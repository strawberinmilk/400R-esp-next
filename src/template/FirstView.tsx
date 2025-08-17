import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import style from "@/css/template/firstView.module.scss";

import { UseBluetooth } from "@/hooks/useBluetooth";

interface FirstViewProps {
  setIsConnected: (isConnected: boolean) => void;
  bluetoothHook: UseBluetooth;
}

export const FirstView: React.FC<FirstViewProps> = ({
  setIsConnected,
  bluetoothHook,
}) => {
  const handleConnect = async () => {
    const status = await bluetoothHook.sendBLEData({ mode: "getStatus" });
    if (status) {
      setIsConnected(true);
    }
    // エラーはbluetoothHook.errorで表示可能
  };

  return (
    <div className={style.firstViewWrapper}>
      <Button
        className={style.firstViewButton}
        variant="contained"
        color="primary"
        onClick={handleConnect}
        sx={{ mb: 4 }}
        disabled={bluetoothHook.isConnecting}
        startIcon={
          bluetoothHook.isConnecting ? (
            <CircularProgress size={20} color="inherit" />
          ) : undefined
        }
      >
        {bluetoothHook.isConnecting ? "接続中..." : "BLE接続"}
      </Button>
      {bluetoothHook.error && (
        <div style={{ color: "red" }}>{bluetoothHook.error}</div>
      )}
    </div>
  );
};
