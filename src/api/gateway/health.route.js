import { runtimeHealth } from "../../runtime/services/runtime.health.js";

export default function healthRoute(app) {
  app.get("/api/soc/health", (_, res) => {
    res.json(runtimeHealth());
  });
}
