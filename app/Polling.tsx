"use client";

import { useEffect } from "react";
import { refetchItems } from "./actions";

export function Polling() {
  useEffect(() => {
    const interval = setInterval(() => {
      refetchItems();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchItems]);

  return null;
}
