import { createKernel } from "../core/kernel/bootstrap/syscall.boot.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mountKernelObservability = require("../core/kernel/contract/observability.routes.cjs");

export function mountRuntime(app){
  try {
    const kernel = createKernel?.();

    if(kernel){
      mountKernelObservability?.(app, kernel);
    }

    return kernel;

  } catch(error){
    console.log("Runtime boot skipped:", error.message);
    return null;
  }
}
