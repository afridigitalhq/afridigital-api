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
