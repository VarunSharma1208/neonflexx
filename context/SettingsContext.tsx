"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/settings-defaults";

export type { SiteSettings };

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => { if (json.success) setSettings(json.data); })
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
