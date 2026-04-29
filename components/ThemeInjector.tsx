"use client";

import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

function adjustHex(hex: string, amount: number): string {
  const clamped = (n: number) => Math.max(0, Math.min(255, n));
  const r = clamped(parseInt(hex.slice(1, 3), 16) + amount);
  const g = clamped(parseInt(hex.slice(3, 5), 16) + amount);
  const b = clamped(parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function ThemeInjector() {
  const { primaryColor } = useSettings();

  useEffect(() => {
    if (!primaryColor?.startsWith("#")) return;
    const root = document.documentElement;
    root.style.setProperty("--gold", primaryColor);
    root.style.setProperty("--gold-dark", adjustHex(primaryColor, -30));
    root.style.setProperty("--gold-light", adjustHex(primaryColor, 80));
  }, [primaryColor]);

  return null;
}
