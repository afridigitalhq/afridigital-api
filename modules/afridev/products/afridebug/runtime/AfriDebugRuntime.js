import AfriDebugRuntimeAdapter from "./AfriDebugRuntimeAdapter.js";

const AfriDebugRuntime={
 boot(context={}){
  return AfriDebugRuntimeAdapter.boot(context);
 }
};

export default AfriDebugRuntime;
