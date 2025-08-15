"use client";
import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

export type SnackbarContextType = {
  showSnackbar: (message: string) => void;
};

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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </SnackbarContext.Provider>
  );
};
