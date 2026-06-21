import { useEffect, useRef } from "react";

/**
 * Visualizes fluid field as heat propagation overlay
 * (maps CPU sim → GPU-like visualization layer)
 */
export function useFluidRenderer(containerRef, field) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";

    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    const render = () => {
      if (!field) {
        requestAnimationFrame(render);
        return;
      }

      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const size = Math.sqrt(field.length);

      for (let i = 0; i < field.length; i++) {
        const x = i % size;
        const y = Math.floor(i / size);
        const v = field[i];

        if (v > 0.5) {
          ctx.fillStyle = `rgba(255,50,0,${Math.min(1, v / 10)})`;
          ctx.fillRect(x * 4, y * 4, 4, 4);
        }
      }

      requestAnimationFrame(render);
    };

    render();

    return () => canvas.remove();
  }, [containerRef, field]);

  return canvasRef;
}
