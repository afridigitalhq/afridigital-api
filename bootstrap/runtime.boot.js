import mountKernelObservability from "./../core/kernel/contract/observability.routes.cjs";
import { mountKernelRuntime } from "./kernel-runtime.boot.js";
import registerModules from "../src/api/gateway/modules.route.js";

export function mountRuntime(app){

  registerModules(app);

  const kernel = mountKernelRuntime();

  if(kernel){
    mountKernelObservability?.(app, kernel);
  }

  return kernel;
}
