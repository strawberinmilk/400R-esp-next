import { UseBluetooth } from "@/hooks/useBluetooth";
import FootLightVolume from "@/components/FootLightVolume";
import FootLightMode from "@/components/FootLightMode";
import GetStatus from "@/components/GetStatus";
import Preset from "@/components/Preset";

interface SettingProps {
  bluetoothHook: UseBluetooth;
}

export const Setting: React.FC<SettingProps> = ({ bluetoothHook }) => {
  return (
    <>
      <FootLightVolume bluetoothHook={bluetoothHook} />
      <FootLightMode bluetoothHook={bluetoothHook} />
      <Preset bluetoothHook={bluetoothHook} />

      <br />
      <GetStatus bluetoothHook={bluetoothHook} />
    </>
  );
};
