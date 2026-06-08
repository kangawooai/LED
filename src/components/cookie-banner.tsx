"use client";

import { useCookieConsent } from "@/contexts/cookie-consent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IconCookie } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    id: "essential" as const,
    label: "Essential",
    description: "Required for the site to function. Cannot be disabled.",
    locked: true,
  },
  {
    id: "analytics" as const,
    label: "Analytics",
    description: "Help us understand how visitors use the site.",
    locked: false,
  },
  {
    id: "marketing" as const,
    label: "Marketing",
    description: "Used to deliver relevant ads and track campaigns.",
    locked: false,
  },
];

const CookieBanner = () => {
  const { bannerOpen, hasConsented, preferences, acceptAll, rejectAll, updatePreferences, openBanner } =
    useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [draft, setDraft] = useState({ analytics: true, marketing: true });

  const handleOpenPreferences = () => {
    // If user already consented (reopening from footer), show their current choices.
    // Otherwise (first visit), default all to checked.
    setDraft(
      hasConsented
        ? { analytics: preferences.analytics, marketing: preferences.marketing }
        : { analytics: true, marketing: true },
    );
    setShowPreferences(true);
  };

  const handleSave = () => {
    updatePreferences(draft);
  };

  return (
    <>
      {/* Cookie icon toggle — visible when banner is closed and user has already consented */}
      <AnimatePresence>
        {!bannerOpen && hasConsented && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={openBanner}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-[51] size-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer shadow-lg"
            aria-label="Cookie settings"
          >
            <IconCookie className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cookie consent banner */}
      <AnimatePresence>
      {bannerOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-[110] p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto bg-background/95 backdrop-blur-xl border border-white/10 rounded-md p-5 md:p-6 shadow-2xl">
            {!showPreferences ? (
              <div>
                <p className="text-sm text-foreground/80">
                  We use cookies to improve your experience and analyse site
                  traffic. Read our{" "}
                  <Link
                    href="/cookie-policy"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    cookie policy
                  </Link>{" "}
                  for more information.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={acceptAll} size="sm">
                    Accept All
                  </Button>
                  <Button onClick={rejectAll} variant="outline" size="sm">
                    Reject All
                  </Button>
                  <Button
                    onClick={handleOpenPreferences}
                    variant="ghost"
                    size="sm"
                  >
                    Manage Preferences
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                  Cookie Preferences
                </p>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const checked = cat.locked
                      ? true
                      : draft[cat.id as keyof typeof draft];
                    return (
                      <label
                        key={cat.id}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <Checkbox
                          className="mt-0.5"
                          checked={checked}
                          disabled={cat.locked}
                          onCheckedChange={
                            cat.locked
                              ? undefined
                              : (val: boolean) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    [cat.id]: val,
                                  }))
                          }
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {cat.label}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {cat.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={handleSave} size="sm">
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowPreferences(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default CookieBanner;
