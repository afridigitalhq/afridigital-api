import { useEffect } from "react";
import { hybridController } from "./HybridModeController";

export function useHybridEngine(dagEngine, wsClient, restClient) {
  useEffect(() => {
    const unsub = hybridController.subscribe(({ type, mode }) => {
      if (type !== "MODE_CHANGE") return;

      if (mode === "rest") {
        wsClient?.disconnect?.();
        restClient?.enable?.();
      }

      if (mode === "hybrid") {
        restClient?.disable?.();
        wsClient?.connect?.();
      }

      if (mode === "fallback") {
        wsClient?.safeMode?.();
        restClient?.enable?.();
      }
    });

    return () => unsub();
  }, [dagEngine, wsClient, restClient]);
}
