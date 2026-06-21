import { useEffect, useRef } from "react";

/**
 * WebGL overlay for heat/propagation field rendering
 * Uses existing WS stream (no backend changes)
 */
export function useGPUFieldOverlay(containerRef, data) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const gl = canvas.getContext("webgl");
    glRef.current = gl;

    if (!gl) return;

    const render = () => {
      if (!data) {
        requestAnimationFrame(render);
        return;
      }

      // normalize field intensity
      const intensity = Math.min(
        1,
        (data.totalHeat || 0) / 1000
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // simple heat overlay (fragment simulation placeholder)
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      // pseudo-field visualization (GPU placeholder logic)
      gl.viewport(0, 0, canvas.width, canvas.height);

      // intensity-driven flash layer
      gl.clearColor(intensity, 0, 0, intensity * 0.4);
      gl.clear(gl.COLOR_BUFFER_BIT);

      requestAnimationFrame(render);
    };

    render();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
    };
  }, [containerRef, data]);

  return canvasRef;
}
