import { defineConfig } from "cypress";

if (typeof process !== "undefined" && process.env) {
  const hasOwn = Object.prototype.hasOwnProperty;

  // Only add if it's missing or broken
  try {
    process.env.hasOwnProperty("test");
  } catch (e) {
    Object.defineProperty(process.env, "hasOwnProperty", {
      value: function (prop) {
        return hasOwn.call(this, prop);
      },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Polyfill for Bun's process.env issue - must be first
      if (typeof process !== "undefined" && process.env) {
        const methods = [
          "hasOwnProperty",
          "propertyIsEnumerable",
          "isPrototypeOf",
        ];
        methods.forEach((method) => {
          try {
            if (
              !process.env[method] ||
              typeof process.env[method] !== "function"
            ) {
              Object.defineProperty(process.env, method, {
                value: Object.prototype[method],
                writable: true,
                enumerable: false,
                configurable: true,
              });
            }
          } catch (e) {
            // Ignore if we can't set it
          }
        });
      }
      return config;
    },
  },
});
