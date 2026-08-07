import afriDebugRoute from "./afridebug/afridebug.route.js";
import afriWhatsAppRoute from "./afriwhatsapp/afriwhatsapp.route.js";
import whatsappDebugRoute from "./whatsapp-debug.route.js";
import afriWhatsAppTestRoute from "./afriwhatsapp-test.route.js";
import metaDebugRoute from "./meta-debug.route.js";
import metaDebugRoute from "./meta-debug.route.js";
import modulesRoute from "./modules.route.js";
import healthRoute from "./health.route.js";
import socRoute from "./soc.route.js";
import ollamaTestRoute from "./ollama-test.route.js";

export default function registerRoutes(app) {
  socRoute(app);
  healthRoute(app);
  modulesRoute(app);
  afriWhatsAppRoute(app);
  whatsappDebugRoute(app);
  afriWhatsAppTestRoute(app);
  metaDebugRoute(app);
  metaDebugRoute(app);
  afriDebugRoute(app);
  ollamaTestRoute(app);
}
