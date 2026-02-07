/// <reference types="cypress" />

// WORKAROUND for Bun + Windows + Cypress compatibility issue
// Bun's process.env on Windows doesn't have Object.prototype methods
// This polyfill must run before any Cypress plugins that check env vars
// Reference: https://github.com/oven-sh/bun/pull/26316

if (typeof process !== "undefined" && process.env) {
  const hasOwn = Object.prototype.hasOwnProperty;

  try {
    // Test if hasOwnProperty works
    process.env.hasOwnProperty("test");
  } catch (e) {
    // It doesn't work, add the polyfill
    ["hasOwnProperty", "propertyIsEnumerable", "isPrototypeOf"].forEach(
      (method) => {
        if (!process.env[method] || typeof process.env[method] !== "function") {
          Object.defineProperty(process.env, method, {
            value: Object.prototype[method],
            writable: true,
            enumerable: false,
            configurable: true,
          });
        }
      },
    );
  }
}
