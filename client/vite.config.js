import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression, defineAlgorithm } from "vite-plugin-compression2";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const ReactCompilerConfig = {};
const ViteImageOptimizerConfig = {
  logStats: true,
  ansiColors: true,
  test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
  exclude: undefined,
  include: undefined,
  includePublic: true,
  svg: {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupNumericValues: false,
            cleanupIds: {
              minify: false,
              remove: false,
            },
            convertPathData: false,
          },
        },
      },
      "sortAttrs",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
        },
      },
    ],
  },
  png: {
    quality: 100,
  },
  jpeg: {
    quality: 100,
  },
  jpg: {
    quality: 100,
  },
  tiff: {
    quality: 100,
  },
  gif: {},
  webp: {
    lossless: true,
  },
  avif: {
    lossless: true,
  },
  cache: false,
  cacheLocation: undefined,
};

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
    ViteImageOptimizer(ViteImageOptimizerConfig),
    compression({
      algorithms: [
        "gzip",
        "brotliCompress",
        defineAlgorithm("deflate", { level: 9 }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: { chunkSizeWarningLimit: 1600 },
});
