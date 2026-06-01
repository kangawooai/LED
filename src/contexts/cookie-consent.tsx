"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CookiePreferences } from "@/types/cookie-consent";

const STORAGE_KEY = "cookie-consent";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

interface CookieConsentContext {
  preferences: CookiePreferences;
  hasConsented: boolean;
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<Omit<CookiePreferences, "essential">>) => void;
  openBanner: () => void;
}

const CookieConsentCtx = createContext<CookieConsentContext | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [hasConsented, setHasConsented] = useState(true); // default true to avoid flash
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences;
        const prefs = { ...parsed, essential: true };
        setPreferences(prefs);
        setHasConsented(true);

        // Restore Google Consent Mode v2 for returning visitors
        if (typeof window.gtag === "function") {
          window.gtag("consent", "update", {
            ad_storage: prefs.marketing ? "granted" : "denied",
            ad_user_data: prefs.marketing ? "granted" : "denied",
            ad_personalization: prefs.marketing ? "granted" : "denied",
            analytics_storage: prefs.analytics ? "granted" : "denied",
            personalization_storage: prefs.marketing ? "granted" : "denied",
          });
        }
      } catch {
        setHasConsented(false);
        setBannerOpen(true);
      }
    } else {
      setHasConsented(false);
      setBannerOpen(true);
    }
  }, []);

  const save = useCallback((prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsented(true);
    setBannerOpen(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    // Google Consent Mode v2 update
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: prefs.marketing ? "granted" : "denied",
        ad_user_data: prefs.marketing ? "granted" : "denied",
        ad_personalization: prefs.marketing ? "granted" : "denied",
        analytics_storage: prefs.analytics ? "granted" : "denied",
        personalization_storage: prefs.marketing ? "granted" : "denied",
      });
    }
  }, []);

  const acceptAll = useCallback(() => {
    save({ essential: true, analytics: true, marketing: true });
  }, [save]);

  const rejectAll = useCallback(() => {
    save({ essential: true, analytics: false, marketing: false });
  }, [save]);

  const updatePreferences = useCallback(
    (partial: Partial<Omit<CookiePreferences, "essential">>) => {
      const next: CookiePreferences = { ...preferences, ...partial, essential: true };
      save(next);
    },
    [preferences, save],
  );

  const openBanner = useCallback(() => {
    setBannerOpen(true);
  }, []);

  return (
    <CookieConsentCtx.Provider
      value={{ preferences, hasConsented, bannerOpen, acceptAll, rejectAll, updatePreferences, openBanner }}
    >
      {children}
    </CookieConsentCtx.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentCtx);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
