"use client";

import { useState, useRef } from "react";

export type UseBluetooth = {
  isConnecting: boolean;
  error: string | null;
  sendBLEData: (data: object) => Promise<boolean>;
};
import {
  DEVICE_NAME,
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
} from "../constants/bluetooth";

export const useBluetooth: () => UseBluetooth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(
    null
  );

  // デバイス取得関数
  const getBluetoothCharacteristic = async () => {
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

  const sendBLEData = async (data: object) => {
    setIsConnecting(true);
    setError(null);
    try {
      const characteristic = await getBluetoothCharacteristic();
      const payload = JSON.stringify(data);
      const encoder = new TextEncoder();
      await characteristic!.writeValue(encoder.encode(payload));
      return true;
    } catch (e: unknown) {
      if (e && typeof e === "object" && "message" in e) {
        setError((e as { message?: string }).message || "送信失敗");
      } else {
        setError("送信失敗");
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return { isConnecting, error, sendBLEData };
};
