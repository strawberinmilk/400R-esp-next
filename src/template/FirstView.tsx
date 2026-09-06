import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import style from "@/css/template/firstView.module.scss";
import { UseBluetooth } from "@/hooks/useBluetooth";

interface FirstViewProps {
  bluetoothHook: UseBluetooth;
}

export const FirstView: React.FC<FirstViewProps> = ({ bluetoothHook }) => {
  // BLE接続ボタンが押されたときの処理
  const handleConnect = async () => {
    await bluetoothHook.sendBLEData({
      mode: "getStatus",
    });
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
