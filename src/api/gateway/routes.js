import modulesRoute from "./modules.route.js";
import healthRoute from "./health.route.js";
import socRoute from "./soc.route.js";

export default function registerRoutes(app) {
  socRoute(app);
  healthRoute(app);
  modulesRoute(app);
}
