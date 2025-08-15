"use client";

import styles from "./page.module.css";
import React from "react";

import { useBluetooth } from "@/hooks/useBluetooth";
import { useState } from "react";
import Setting from "@/template/Setting";
import FirstView from "@/template/FirstView";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const bluetoothHook = useBluetooth(isConnected);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainCenter}>
        {!isConnected ? (
          <FirstView setIsConnected={setIsConnected} />
        ) : (
          <>
            <Setting bluetoothHook={bluetoothHook} />
          </>
        )}
      </main>
    </div>
  );
}
