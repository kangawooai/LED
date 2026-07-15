"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed recently
    const dismissed = localStorage.getItem("install-prompt-dismissed");
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Listen for the browser's install prompt (Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For Safari/iOS — show manual instructions after a delay
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("install-prompt-dismissed", String(Date.now()));
    setShow(false);
  };

  if (!show) return null;

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 bg-background/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Add Leads Every Day to your home screen</p>
        <p className="text-xs text-foreground/50">
          Get instant access and push notifications when new leads come in.
        </p>
      </div>
      {isIOS ? (
        <p className="text-xs text-foreground/60">
          Tap the <span className="font-semibold">share</span> button in Safari, then <span className="font-semibold">&quot;Add to Home Screen&quot;</span>.
        </p>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstall} className="flex-1">
            Install App
          </Button>
          <Button size="sm" variant="outline" onClick={handleDismiss}>
            Not now
          </Button>
        </div>
      )}
      {isIOS && (
        <Button size="sm" variant="outline" onClick={handleDismiss} className="w-full">
          Got it
        </Button>
      )}
    </div>
  );
}
