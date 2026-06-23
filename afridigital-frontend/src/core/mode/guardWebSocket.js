import { isRestMode } from "./runtimeMode";

export function safeWebSocket(url) {
  if (isRestMode) {
    return {
      onmessage: null,
      // REST MODE CONNECTION DISABLED
      close: () => {},
      send: () => {},
    };
  }

  return null;
}
