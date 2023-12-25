import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1/": {
        target: "https://greenville.onrender.com/",
        changeOrigin: true,
        secure: false,
        ws: true,
        cookiePathRewrite: {
          "*": "/",
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });

          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  envFile: ".env",
});
