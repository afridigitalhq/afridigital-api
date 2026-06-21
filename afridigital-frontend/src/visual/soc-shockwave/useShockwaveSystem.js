import { useEffect, useRef } from "react";
import { ShockwaveEngine } from "./shockwaveEngine";

/**
 * SOC Shockwave Renderer Hook
 * - merges incidents into propagation systems
 * - outputs drawable wavefronts
 */

export function useShockwaveSystem(canvas, ws) {
  const raf = useRef();
  const engine = useRef(new ShockwaveEngine());

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waves = engine.current.step();

      for (const w of waves) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,80,80,${Math.min(0.8, w.intensity / 100)})`;
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf.current = requestAnimationFrame(render);
    };

    if (ws) {
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          if (data.type === "FIELD_DIFF") {
            engine.current.ingest([
              ...(data.added || []),
              ...(data.updated || [])
            ]);
          }
        } catch (e) {}
      };
    }

    render();

    return () => cancelAnimationFrame(raf.current);
  }, [canvas, ws]);
}
