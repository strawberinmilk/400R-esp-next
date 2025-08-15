import Button from "@mui/material/Button";
import style from "@/css/template/firstView.module.scss";

interface FirstViewProps {
  setIsConnected: (isConnected: boolean) => void;
}

export default function FirstView({ setIsConnected }: FirstViewProps) {
  return (
    <div className={style.firstViewWrapper}>
      <Button
        className={style.firstViewButton}
        variant="contained"
        color="primary"
        onClick={() => setIsConnected(true)}
        sx={{ mb: 4 }}
      >
        BLE接続
      </Button>
    </div>
  );
}
