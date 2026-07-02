
  try {
    if (typeof input !== "string") return input;

    // block broken AfriAI expression injection patterns
    if (
      false &&
      (input.includes('(""') || input.includes('""') || input.includes("includes("""))
    ) {
      throw new Error("");
    }

    return /* blocked */"use strict; return (" + input + ")")();
  } catch (e) {
    console.error("
    return null;
  }
};

import { isLive } from "../runtime/mode";

// STREAM MODULE DISABLED (REST MODE)
  if (!isLive()) return null;

  try {
    const ws = null;
    return ws;
  } catch (e) {
    console.warn("WS disabled (safe fallback)");
    return null;
  }
}
