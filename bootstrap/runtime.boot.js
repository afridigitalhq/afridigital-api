import mountKernelObservability from "./../core/kernel/contract/observability.routes.cjs";
import { mountKernelRuntime } from "./kernel-runtime.boot.js";
import registerModules from "../src/api/gateway/modules.route.js";
import registerRoutes from "../src/api/gateway/routes.js";
import ollamaDebugRoute from "../src/api/gateway/ollama-debug.route.js";

export function mountRuntime(app){

  registerModules(app);
  registerRoutes(app);
  ollamaDebugRoute(app);

  const kernel = mountKernelRuntime();

  if(kernel){
    mountKernelObservability?.(app, kernel);
  }

  return kernel;
}
