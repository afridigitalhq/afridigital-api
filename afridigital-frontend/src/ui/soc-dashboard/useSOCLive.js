// REACT HOOK: LIVE SOC CONNECTION

import { useEffect, useState } from "react";
import { initSOCRuntime } from "../../runtime/soc/socRuntimeController";

export function useSOCLive() {
  const [soc, setSOC] = useState({
    incidents: [],
    summary: { critical: 0, warnings: 0 }
  });

  useEffect(() => {
    initSOCRuntime(setSOC);
  }, []);

  return soc;
}
