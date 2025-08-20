import React from "react";
import Button from "@mui/material/Button";
import { UseBluetooth } from "@/hooks/useBluetooth";
import { useGlobalSnackbar } from "@/util/GlobalSnackbar";
import { isGetStatusResponse } from "@/dto/bluetooth";

interface GetStatusProps {
  bluetoothHook: UseBluetooth;
}

const GetStatus: React.FC<GetStatusProps> = ({ bluetoothHook }) => {
  const { showSnackbar } = useGlobalSnackbar();
  const { isConnecting, sendBLEData, setStatus } = bluetoothHook;

  // ステータス取得を行い取得値をセットする
  const handleGetStatusAndSetStatus = async () => {
    const result = await sendBLEData({ mode: "getStatus" });
    if (result && isGetStatusResponse(result)) {
      setStatus(result);
      showSnackbar(JSON.stringify(result), "#FFF");
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleGetStatusAndSetStatus}
      disabled={isConnecting}
      sx={{ mt: 2 }}
    >
      ステータス取得
    </Button>
  );
};

export default GetStatus;
