import mountKernelObservability from "./../core/kernel/contract/observability.routes.cjs";
import { mountKernelRuntime } from "./kernel-runtime.boot.js";
import { registerProductRoutes } from "../src/api/products/routes.js";
import registerModules from "../src/api/gateway/modules.route.js";
import registerRoutes from "../src/api/gateway/routes.js";
import ollamaDebugRoute from "../src/api/gateway/ollama-debug.route.js";

export function mountRuntime(app){

  console.log("A2A_BOOT: runtime-start");
  registerProductRoutes(app);
  registerModules(app);
  console.log("A2A_BOOT: before-registerRoutes");
  registerRoutes(app);
  console.log("A2A_BOOT: after-registerRoutes");
  ollamaDebugRoute(app);

  const kernel = mountKernelRuntime();

  if(kernel){
    mountKernelObservability?.(app, kernel);
  }

  return kernel;
}
