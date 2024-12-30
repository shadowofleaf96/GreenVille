import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [react(), compression()],
  build: { chunkSizeWarningLimit: 1600 },
});
