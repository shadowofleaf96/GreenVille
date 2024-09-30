import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1/": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        cookiePathRewrite: {
          "*": "/",
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending request to target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received response from target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  envDir: './',
});
