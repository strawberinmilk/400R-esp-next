"use client";
import React, { createContext, useContext, useState } from "react";
import "@/css/_constants.scss";
export type SnackbarContextType = {
  showSnackbar: (message: string, color?: string) => void;
};
import Snackbar from "@mui/material/Snackbar";

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useGlobalSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx)
    throw new Error(
      "useGlobalSnackbar must be used within GlobalSnackbarProvider"
    );
  return ctx;
};

export const GlobalSnackbarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // CSSカスタムプロパティから色を取得
  function getCssVar(name: string) {
    if (typeof window === "undefined") return "";
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || ""
    );
  }
  const [primaryColor, setPrimaryColor] = useState<string>("");

  React.useEffect(() => {
    setPrimaryColor(getCssVar("--primary-color"));
  }, []);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<string>(primaryColor);

  const showSnackbar = (msg: string, color?: string) => {
    setMessage(msg);
    setColor(color || primaryColor);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={<span style={{ color }}>{message}</span>}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </SnackbarContext.Provider>
  );
};
