let DISPATCH_REF = null;

function bindDispatch(fn) {
  if (!fn) throw new Error("Missing dispatch");

  DISPATCH_REF = fn;

  return function trampoline(event) {
    if (!DISPATCH_REF) throw new Error("Dispatch not ready");
    return DISPATCH_REF(event);
  };
}

module.exports = { bindDispatch };
