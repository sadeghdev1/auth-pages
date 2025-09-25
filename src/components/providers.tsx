// @ts-nocheck

"use client";

import { Toaster } from "react-hot-toast";
import React from "react";

export default function Providers({ children }) {
  return (
    <>
      {/* Toaster should be client-only and placed once in the app */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // default options (optional)
          duration: 4000,
        }}
      />
      {children}
    </>
  );
}
