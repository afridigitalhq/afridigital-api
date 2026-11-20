import afriDebugRoute from "./afridebug/afridebug.route.js";
import a2aRoute from "./a2a/a2a.route.js";
import internalA2ARoute from "./a2a/internal-a2a.route.js";
import internalApprovalRoute from "./a2a/internal-approval.route.js";
import afriWhatsAppRoute from "./afriwhatsapp/afriwhatsapp.route.js";
import afriWebRoute from "./afriweb/afriweb.route.js";
import whatsappDebugRoute from "./whatsapp-debug.route.js";
import afriWhatsAppTestRoute from "./afriwhatsapp-test.route.js";
import metaDebugRoute from "./meta-debug.route.js";
import modulesRoute from "./modules.route.js";
import socRoute from "./soc.route.js";
import ollamaTestRoute from "./ollama-test.route.js";
import ollamaDebugRoute from "./ollama-debug.route.js";
import healthRoute from "./health.route.js";
import agentPlatformReadinessRoute from "./agent-platform-readiness.route.js";
import afriDesignAPKRoute from "./afridesign/afridesign-apk.route.js";
import afriSportsRoute from "../../afrisports/routes/afrisports.route.js";
import afriForexRoute from "../../afriforex/routes/afriforex.route.js";

export default function registerRoutes(app) {
  socRoute(app);
  modulesRoute(app);
  afriWhatsAppRoute(app);
  afriWebRoute(app);
  whatsappDebugRoute(app);
  afriWhatsAppTestRoute(app);
  metaDebugRoute(app);
  afriDebugRoute(app);
  a2aRoute(app);
  internalA2ARoute(app);
  internalApprovalRoute(app);
  ollamaTestRoute(app);
  ollamaDebugRoute(app);
  healthRoute(app);
  agentPlatformReadinessRoute(app);
  afriDesignAPKRoute(app);
  app.use("/api/afrisports", afriSportsRoute);
  app.use("/api/afriforex", afriForexRoute);
  }
