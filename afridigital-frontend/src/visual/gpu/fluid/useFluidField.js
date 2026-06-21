import { useEffect, useRef, useState } from "react";
import { createFluidSim } from "./pingPongFluid";

/**
 * Converts WS SOC events into fluid simulation density field
 */
export function useFluidField(events) {
  const simRef = useRef(null);
  const [, force] = useState(0);

  if (!simRef.current) {
    simRef.current = createFluidSim(128);
  }

  useEffect(() => {
    if (!events) return;

    const sim = simRef.current;

    // inject incidents into fluid grid
    events.forEach(e => {
      const heat = e.physics?.heat || 0;

      const x = Math.floor((e.id % 128));
      const y = Math.floor((heat % 128));

      sim.addDensity(x, y, heat);
    });

    sim.step();
    force(x => x + 1);

  }, [events]);

  return simRef.current.getField();
}
