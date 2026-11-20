import test from "node:test";
import assert from "node:assert/strict";
import registerRoutes from "./routes.js";

test("gateway registers both protected Ollama diagnostics endpoints exactly once", () => {
  const registrations = new Map();
  const app = new Proxy({}, {
    get(_target, method) {
      if (method === "get") {
        return (path, ...handlers) => {
          registrations.set(path, (registrations.get(path) || 0) + 1);
          if (path === "/api/afriai/ollama-test" || path === "/api/afriai/ollama-debug") {
            assert.equal(handlers.length, 2, path + " must have authorization and route handlers");
            assert.equal(typeof handlers[0], "function");
            assert.equal(typeof handlers[1], "function");
          }
        };
      }
      return () => {};
    }
  });

  registerRoutes(app);

  assert.equal(registrations.get("/api/afriai/ollama-test"), 1);
  assert.equal(registrations.get("/api/afriai/ollama-debug"), 1);
});
