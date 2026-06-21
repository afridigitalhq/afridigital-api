import { useEffect, useRef } from "react";

/**
 * GPU Particle Advection (flow field movement)
 * - particles follow velocity field
 * - WS injects new incidents
 * - RAF sync for smooth motion
 */

export function useParticleFlow(canvas, ws) {
  const raf = useRef();
  const particles = useRef(new Map());

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // CPU fallback sim (GPU hook point reserved)
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // update particles
      particles.current.forEach(p => {
        const vx = p.vx || 0;
        const vy = p.vy || 0;

        p.x += vx;
        p.y += vy;

        // damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // render
        ctx.fillStyle = `rgba(255,120,50,0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + (p.heat || 0) * 0.05, 0, Math.PI * 2);
        ctx.fill();
      });

      raf.current = requestAnimationFrame(step);
    };

    // WS injection layer
    if (ws) {
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          if (data.type === "FIELD_DIFF") {
            (data.added || []).forEach(e => {
              particles.current.set(e.id, {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                heat: e.physics?.heat || 0
              });
            });
          }
        } catch (e) {}
      };
    }

    step();

    return () => cancelAnimationFrame(raf.current);
  }, [canvas, ws]);
}
