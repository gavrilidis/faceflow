import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { en } from "./en";
import { ru } from "./ru";
import type { TranslationKey } from "./en";

export type Locale = "en" | "ru";
export type Theme = "dark" | "light" | "system";

const translations = { en, ru } as const;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
  glassIntensity: number;
  setGlassIntensity: (v: number) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getSystemTheme(): "dark" | "light" {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem("faceflow-locale");
    return (stored === "ru" ? "ru" : "en") as Locale;
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("faceflow-theme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    return "dark";
  });

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(getSystemTheme);

  const [glassIntensity, setGlassIntensityState] = useState<number>(() => {
    const stored = localStorage.getItem("faceflow-glass");
    return stored ? parseFloat(stored) : 0.7;
  });

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  // Apply glass intensity
  useEffect(() => {
    const blur = Math.round(glassIntensity * 30);
    const sat = Math.round(100 + glassIntensity * 80);
    const opacity = (0.5 + glassIntensity * 0.35).toFixed(2);
    document.documentElement.style.setProperty("--glass-blur", `${blur}px`);
    document.documentElement.style.setProperty("--glass-saturation", `${sat}%`);
    document.documentElement.style.setProperty("--glass-opacity", opacity);
  }, [glassIntensity]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("faceflow-locale", l);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("faceflow-theme", t);
  }, []);

  const setGlassIntensity = useCallback((v: number) => {
    setGlassIntensityState(v);
    localStorage.setItem("faceflow-glass", String(v));
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string>): string => {
      let text = translations[locale][key] ?? translations.en[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, v);
        }
      }
      return text;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, theme, setTheme, resolvedTheme, glassIntensity, setGlassIntensity }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
