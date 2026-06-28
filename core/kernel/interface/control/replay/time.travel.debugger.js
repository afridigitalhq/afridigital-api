// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * TIME TRAVEL DEBUGGER
 * Computes diff between two control-plane states
 */

class TimeTravelDebugger {
  diff(stateA, stateB) {
    const diff = {};

    const keys = new Set([
      ...Object.keys(stateA || {}),
      ...Object.keys(stateB || {})
    ]);

    keys.forEach((key) => {
      if (JSON.stringify(stateA?.[key]) !== JSON.stringify(stateB?.[key])) {
        diff[key] = {
          from: stateA?.[key] ?? null,
          to: stateB?.[key] ?? null
        };
      }
    });

    return diff;
  }
}

module.exports = { TimeTravelDebugger };
