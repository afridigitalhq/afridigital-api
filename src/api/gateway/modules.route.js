import { getModules } from "../../runtime/modules/module.registry.js";

export default function modulesRoute(app) {
  app.get("/api/soc/modules", (_, res) => {
    res.json(getModules());
  });
}
