import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ma.mk.greenville",
  appName: "GreenVille",
  webDir: "dist",
  server: {
    url: "https://greenville-frontend.onrender.com",
    cleartext: true
  },
};

export default config;
