import { UseBluetooth } from "@/hooks/useBluetooth";
import GetStatus from "@/components/GetStatus";
import Preset from "@/components/Preset";
import PwmLedVolume from "@/components/PwmLedVolume";
import PwmLedMode from "@/components/PwmLedMode";

interface SettingProps {
  bluetoothHook: UseBluetooth;
}

export const Setting: React.FC<SettingProps> = ({ bluetoothHook }) => {
  return (
    <>
      {/* FootLight用 */}
      <PwmLedVolume
        bluetoothHook={bluetoothHook}
        lightType="footLight"
        label="フットライト明度"
        mode="footLightVol"
      />
      <PwmLedMode
        bluetoothHook={bluetoothHook}
        ledType="footLight"
        label="フットライトモード"
        mode="footLightMode"
      />

      {/* HeartLight用 */}
      <PwmLedVolume
        bluetoothHook={bluetoothHook}
        lightType="heartLight"
        label="ハートライト明度"
        mode="heartLightVol"
      />
      <PwmLedMode
        bluetoothHook={bluetoothHook}
        ledType="heartLight"
        label="ハートライトモード"
        mode="heartLightMode"
      />

      <Preset bluetoothHook={bluetoothHook} />
      <br />
      <GetStatus bluetoothHook={bluetoothHook} />
    </>
  );
};
