import test from "node:test";
import assert from "node:assert/strict";
import registerRoutes from "./routes.js";

test("gateway registers protected Ollama diagnostics and identity endpoints exactly once", () => {
  const registrations = new Map();
  const app = new Proxy({}, {
    get(_target, method) {
      if (method === "get" || method === "post") {
        return (path, ...handlers) => {
          const key = `${method} ${path}`;
          registrations.set(key, (registrations.get(key) || 0) + 1);

          if (method === "get" &&
              (path === "/api/afriai/ollama-test" || path === "/api/afriai/ollama-debug")) {
            assert.equal(handlers.length, 2, path + " must have authorization and route handlers");
            assert.equal(typeof handlers[0], "function");
            assert.equal(typeof handlers[1], "function");
          }

          if (method === "post" &&
              (path === "/api/identity/bootstrap-admin" || path === "/api/identity/login")) {
            assert.equal(handlers.length, 1, path + " must have one route handler");
            assert.equal(typeof handlers[0], "function");
          }
        };
      }
      return () => {};
    }
  });

  registerRoutes(app);

  for (const key of [
    "get /api/afriai/ollama-test",
    "get /api/afriai/ollama-debug",
    "post /api/identity/bootstrap-admin",
    "post /api/identity/login"
  ]) assert.equal(registrations.get(key), 1, `${key} must be registered exactly once`);
});
