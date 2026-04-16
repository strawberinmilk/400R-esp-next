"use client";

import { useState, useRef, useEffect } from "react";

import {
  DEVICE_NAME,
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
} from "../constants/bluetooth";
import {
  SetResultResponse,
  GetStatusResponse,
  isGetStatusResponse,
} from "../dto/bluetooth";

export interface UseBluetooth {
  isConnecting: boolean;
  error: string | null;
  sendBLEData: (
    data: object,
  ) => Promise<GetStatusResponse | SetResultResponse | null>;
  status: GetStatusResponse | null;
  setStatus: React.Dispatch<React.SetStateAction<GetStatusResponse | null>>;
}

export const useBluetooth: (isEnabled?: boolean) => UseBluetooth = (
  isEnabled = false,
) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GetStatusResponse | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(
    null,
  );
  const bufferRef = useRef<string>("");

  // 接続確立時にステータスを取得
  useEffect(() => {
    if (!isEnabled) return;
    (async () => {
      await sendBLEData({ mode: "getStatus" });
      // if (isGetStatusResponse(res)) {
      // setStatus(res);
      // }
      setIsConnecting(true);
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
        const characteristic =
          await service.getCharacteristic(CHARACTERISTIC_UUID);
        // notify 開始
        await characteristic.startNotifications();
        characteristic.addEventListener(
          "characteristicvaluechanged",
          handleNotify,
        );
        characteristicRef.current = characteristic;
      }
      return characteristicRef.current;
    };

  // データを送信
  const sendBLEData: (
    data: object,
  ) => Promise<GetStatusResponse | SetResultResponse | null> = async (data) => {
    setIsConnecting(true);
    setError(null);
    try {
      const characteristic = await getBluetoothCharacteristic();
      const payload = JSON.stringify(data);
      const encoder = new TextEncoder();
      await characteristic!.writeValue(encoder.encode(payload));
      // 受信待ち
      // const response = await characteristic!.readValue();
      // const decoder = new TextDecoder();
      // const json = JSON.parse(decoder.decode(response.buffer));
      // return json;
      return null; // レスポンスはnotifyで受ける
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

  const handleNotify = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const decoder = new TextDecoder();
    const chunk = decoder.decode(target.value!.buffer);

    console.log("BLE chunk:", chunk);
    bufferRef.current += chunk;
    // 👇 改行区切りで処理
    const lines = bufferRef.current.split("\n");

    // 最後は未完の可能性があるので残す
    bufferRef.current = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        console.log(`line: ${line}`);
        const json = JSON.parse(line);
        console.log("BLE complete:", json);

        if (isGetStatusResponse(json)) {
          console.log("BLE status response:", json);
          setStatus(json);
        } else {
          console.log("BLE response:", json);
        }
      } catch (e) {
        console.error("parse失敗:", line, e);
      }
    }
  };

  return { isConnecting, error, sendBLEData, status, setStatus };
};
