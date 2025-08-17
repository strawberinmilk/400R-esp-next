import React from "react";
import Button from "@mui/material/Button";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { useGlobalSnackbar } from "@/util/GlobalSnackbar";

export async function sendGetStatus(
  sendBLEData: (data: object) => Promise<any>,
  showSnackbar: (msg: string, color?: string) => void,
  setStatus: (status: any) => void
) {
  const result = await sendBLEData({ mode: "getStatus" });
  if (result) {
    if (result.type === "status") {
      setStatus(result);
    }
    //TODO: 色をcssから取得
    const color = result.exitCode === 0 ? "#4caf50" : "#f44336";
    const msg =
      result.message && result.message.length > 0
        ? result.message
        : JSON.stringify(result);
    showSnackbar(msg, color);
  }
}

interface GetStatusProps {
  bluetoothHook: UseBluetooth;
}

const GetStatus: React.FC<GetStatusProps> = ({ bluetoothHook }) => {
  const { showSnackbar } = useGlobalSnackbar();
  const { isConnecting, sendBLEData, setStatus } = bluetoothHook;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => sendGetStatus(sendBLEData, showSnackbar, setStatus)}
      disabled={isConnecting}
      sx={{ mt: 2 }}
    >
      ステータス取得
    </Button>
  );
};

export default GetStatus;
