import mountKernelObservability from "./../core/kernel/contract/observability.routes.cjs";
import { mountKernelRuntime } from "./kernel-runtime.boot.js";

export function mountRuntime(app){
  const kernel = mountKernelRuntime();

  if(kernel){
    mountKernelObservability?.(app, kernel);
  }

  return kernel;
}
