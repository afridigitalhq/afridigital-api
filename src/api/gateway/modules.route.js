import socRoute from "./soc.route.js";
import featureFlagsRoute from "../modules/feature-flags/featureFlags.route.js";
import afriaiRoute from "./afriai.route.js";

export default function registerModules(app){
  app.use("/api/soc", socRoute);
  app.use("/api/feature-flags", featureFlagsRoute);
  app.use("/api/afriai", afriaiRoute);
}
