"use client";

import styles from "./page.module.css";
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import FootLight from "../template/FootLight";
import { useBluetooth } from "@/hooks/useBluetooth";

export default function Home() {
  const { isConnecting, error, sendBLEData } = useBluetooth();
  const [toastOpen, setToastOpen] = useState(false);

  async function handleSend(footLightVolume: number) {
    const success = await sendBLEData({
      mode: "footLightVol",
      value: footLightVolume,
    });
    if (success) setToastOpen(true);
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainCenter}>
        <FootLight
          isConnecting={isConnecting}
          error={error}
          handleSend={handleSend}
        />
      </main>
      <footer className={styles.footerFixed}>
        <p>© 2025 400R ESP32 Controller</p>
      </footer>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message="送信しました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
