import { createKernel } from "../core/kernel/bootstrap/syscall.boot.js";

function createRuntimeCore(){
  return {
    dispatch(event){
      return {
        status: "accepted",
        event
      };
    }
  };
}

export function mountKernelRuntime(){
  try {
    const core = createRuntimeCore();
    const kernel = createKernel(core);

    return kernel;
  } catch(error){
    console.log("Kernel runtime skipped:", error.message);
    return null;
  }
}
