import { useEffect, useState } from "react";

const STORAGE_KEY = "cswa_firm_settings";

export interface FirmSettings {
  firmName: string;
  logoDataUrl: string | null;
}

const defaultSettings: FirmSettings = {
  firmName: "CSWA Group of Companies",
  logoDataUrl: null,
};

export function useFirmSettings() {
  const [settings, setSettings] = useState<FirmSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {}
    return defaultSettings;
  });

  const updateSettings = (patch: Partial<FirmSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { settings, updateSettings };
}
