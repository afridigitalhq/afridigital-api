import { useEffect, useState } from "react";
import { initLiveConsciousness, LiveGraphState } from "../live/liveConsciousBridge";

export function useLiveConsciousness() {
  const [, setTick] = useState(0);

  useEffect(() => {
    initLiveConsciousness();

    const interval = setInterval(() => {
      // force render tick (lightweight sync layer)
      setTick(t => t + 1);
    }, 50); // ~20 FPS UI sync layer

    return () => clearInterval(interval);
  }, []);

  return LiveGraphState;
}
