export type CookieCategory = "essential" | "analytics" | "marketing";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  preferences: CookiePreferences;
  hasConsented: boolean;
}
