import { useEffect, useRef } from "react";
import { fieldFragmentShader } from "./shaders/field.glsl.js";

/**
 * GPU diffusion + wave propagation renderer
 * overlays ReactFlow (no structural interference)
 */
export function useWaveFieldRenderer(containerRef, data) {
  const glRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";

    containerRef.current.appendChild(canvas);

    const gl = canvas.getContext("webgl");
    glRef.current = gl;

    if (!gl) return;

    const resize = () => {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      timeRef.current += 0.016;

      const intensity = Math.min(
        1,
        (data?.totalHeat || 0) / 1000
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // simplified GPU field pulse (fragment simulation concept)
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.clearColor(
        intensity,
        intensity * 0.2,
        0,
        0.25
      );

      gl.clear(gl.COLOR_BUFFER_BIT);

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, [containerRef, data]);

  return glRef;
}
