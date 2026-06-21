import { useEffect, useRef } from "react";
import { ClusterEngine } from "./clusterEngine";

/**
 * 🧠 Cluster Overlay Renderer
 * Reads shockwave output → builds intelligence layer
 */

export function useClusterOverlay(canvas, waveSource) {
  const raf = useRef();
  const engine = useRef(new ClusterEngine());

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let waves = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const clusters = engine.current.compute(waves);

      for (const c of clusters) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,180,255,0.6)`;
        ctx.arc(c.center.x, c.center.y, 30 + c.size * 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,180,255,0.2)";
        ctx.fill();
      }

      raf.current = requestAnimationFrame(render);
    };

    // input: wave stream (NOT a new engine)
    waveSource?.onUpdate?.((w) => {
      waves = w;
    });

    render();

    return () => cancelAnimationFrame(raf.current);
  }, [canvas, waveSource]);
}
