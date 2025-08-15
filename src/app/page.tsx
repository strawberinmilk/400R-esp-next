"use client";

import styles from "./page.module.css";
import React from "react";
import FootLightVolume from "../template/FootLightVolume";
import FootLightMode from "../template/FootLightMode";
import { useBluetooth } from "@/hooks/useBluetooth";

export default function Home() {
  const bluetoothHook = useBluetooth();

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainCenter}>
        <FootLightVolume bluetoothHook={bluetoothHook} />
        <FootLightMode bluetoothHook={bluetoothHook} />
      </main>
      <footer className={styles.footerFixed}>
        <p>© 2025 400R ESP32 Controller</p>
      </footer>
    </div>
  );
}
