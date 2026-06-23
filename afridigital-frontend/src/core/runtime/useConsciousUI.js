import { useEffect, useState } from "react";
import { consciousnessEngine } from "../consciousness/ConsciousnessEngine";
import { hybridController } from "../hybrid/HybridModeController";

export function useConsciousUI() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    consciousnessEngine.attach((msg) => {
      setLogs(prev => [...prev.slice(-50), msg]);
    });

    consciousnessEngine.start();

    hybridController.subscribe((event) => {
      if (event.type === "MODE_CHANGE") {
        setLogs(prev => [...prev.slice(-50), `MODE → ${event.mode}`]);
      }
    });
  }, []);

  return { logs, mode: hybridController.getMode?.() };
}
