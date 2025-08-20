import styles from "@/css/layout.module.scss";

import type { Metadata } from "next";
import React from "react";
import { GlobalSnackbarProvider } from "@/util/GlobalSnackbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "400R ESP32 Controller",
  description: "400Rのフットライト等の制御を行う",
};

const RootLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({
  children,
}) => {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalSnackbarProvider>
          {children}
          <footer className={styles.footerFixed}>
            <span>400R ESP32 controller</span>
            &nbsp; ©<a href="https://twitter.com/strawberinmilk">rin;</a> 2025
          </footer>
        </GlobalSnackbarProvider>
      </body>
    </html>
  );
};
export default RootLayout;
