import { UseBluetooth } from "@/hooks/useBluetooth";
import FootLightVolume from "@/components/FootLightVolume";
import FootLightMode from "@/components/FootLightMode";
import GetStatus from "@/components/GetStatus";

interface SettingProps {
  bluetoothHook: UseBluetooth;
}

export default function Setting({ bluetoothHook }: SettingProps) {
  return (
    <>
      <FootLightVolume bluetoothHook={bluetoothHook} />
      <FootLightMode bluetoothHook={bluetoothHook} />
      <GetStatus bluetoothHook={bluetoothHook} />
    </>
  );
}
