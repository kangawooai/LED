import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.co.leadseveryday.app",
  appName: "Leads Everyday",
  webDir: ".next",
  server: {
    url: "http://localhost:3000",
    cleartext: true,
  },
};

export default config;
