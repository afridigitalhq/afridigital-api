import { useEffect, useRef } from "react";
import { PingPongField } from "./pingpongField";

export function useGPUField(canvas, ws) {
  const raf = useRef();

  useEffect(() => {
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const field = new PingPongField(gl);

    const step = () => {
      // 1. read WS payload (heat, propagation)
      // 2. run shader step (diffusion + wave)
      // 3. swap buffers
      field.swap();

      raf.current = requestAnimationFrame(step);
    };

    step();

    return () => cancelAnimationFrame(raf.current);
  }, [canvas, ws]);
}
