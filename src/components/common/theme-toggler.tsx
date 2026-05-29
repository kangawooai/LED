"use client";

import { useEffect } from "react";

interface ThemeTogglerProps {
  lightId: string;
  darkId: string;
}

const ThemeToggler = ({ lightId, darkId }: ThemeTogglerProps) => {
  useEffect(() => {
    const lightEl = document.getElementById(lightId);
    const darkEl = document.getElementById(darkId);

    if (!lightEl || !darkEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === lightId) {
            if (entry.isIntersecting) {
              document.documentElement.classList.remove("dark");
            } else if (entry.boundingClientRect.top > 0) {
              // Features section is below viewport — user scrolled back up
              document.documentElement.classList.add("dark");
            }
          }
          if (entry.target.id === darkId && entry.isIntersecting) {
            document.documentElement.classList.add("dark");
          }
        }
      },
      { threshold: 0, rootMargin: "-40% 0px -60% 0px" }
    );

    observer.observe(lightEl);
    observer.observe(darkEl);

    return () => observer.disconnect();
  }, [lightId, darkId]);

  return null;
};

export default ThemeToggler;
