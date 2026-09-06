"use client";

import styles from "./page.module.css";
import React from "react";

import { useBluetooth } from "@/hooks/useBluetooth";
import { Setting } from "@/template/Setting";
import { FirstView } from "@/template/FirstView";

export default function Home() {
  const bluetoothHook = useBluetooth();

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainCenter}>
        {!bluetoothHook.isConnected ? (
          <FirstView bluetoothHook={bluetoothHook} />
        ) : (
          <>
            <Setting bluetoothHook={bluetoothHook} />
          </>
        )}
      </main>
    </div>
  );
}
