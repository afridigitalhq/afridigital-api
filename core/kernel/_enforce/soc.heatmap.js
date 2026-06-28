const heat = new Map();

function record(origin) {
  heat.set(origin, (heat.get(origin) || 0) + 1);
}

function hookDispatch(dispatchFn) {
  return function(event) {
    record(event?.source || "unknown");
    return dispatchFn(event);
  };
}

function snapshot() {
  return [...heat.entries()]
    .sort((a,b)=>b[1]-a[1])
    .map(([path,hits])=>({path,hits}));
}

module.exports = { hookDispatch, snapshot };
