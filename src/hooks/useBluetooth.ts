"use client";

import { useState, useRef, useEffect } from "react";

import {
  DEVICE_NAME,
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
} from "../constants/bluetooth";
import { SetResult, StatusType } from "../dto/bluetooth";

export interface UseBluetooth {
  isConnecting: boolean;
  error: string | null;
  sendBLEData: (data: object) => Promise<StatusType | SetResult | null>;
  status: StatusType | null;
  setStatus: React.Dispatch<React.SetStateAction<StatusType | null>>;
}

export const useBluetooth: (isEnabled?: boolean) => UseBluetooth = (
  isEnabled = false
) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusType | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(
    null
  );

  // 接続確立時にステータスを取得
  useEffect(() => {
    if (!isEnabled) return;
    (async () => {
      const res = await sendBLEData({ mode: "getStatus" });
      if (res && res.type === "status") {
        setStatus(res);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  // 接続を確立/接続の実態の取得
  const getBluetoothCharacteristic: () => Promise<BluetoothRemoteGATTCharacteristic | null> =
    async () => {
      if (!deviceRef.current || !characteristicRef.current) {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ name: DEVICE_NAME }],
          optionalServices: [SERVICE_UUID],
        });
        deviceRef.current = device;
        if (!device.gatt) {
          throw new Error("Bluetooth GATT is not available on this device.");
        }
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(
          CHARACTERISTIC_UUID
        );
        characteristicRef.current = characteristic;
      }
      return characteristicRef.current;
    };

  // データを送信
  const sendBLEData: (
    data: object
  ) => Promise<StatusType | SetResult | null> = async (data) => {
    setIsConnecting(true);
    setError(null);
    try {
      const characteristic = await getBluetoothCharacteristic();
      const payload = JSON.stringify(data);
      const encoder = new TextEncoder();
      await characteristic!.writeValue(encoder.encode(payload));
      // 受信待ち
      const response = await characteristic!.readValue();
      const decoder = new TextDecoder();
      const json = JSON.parse(decoder.decode(response.buffer));
      return json;
    } catch (e: unknown) {
      if (e && typeof e === "object" && "message" in e) {
        setError((e as { message?: string }).message || "送信失敗");
      } else {
        setError("送信失敗");
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return { isConnecting, error, sendBLEData, status, setStatus };
};
