import { useEffect, useRef } from "react";

export function useSOCCompositor(canvas, ws, reactFlowRef) {
  const raf = useRef();

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let field = new Map();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. draw GPU-style heat layer (CPU proxy for now)
      field.forEach((v, k) => {
        const heat = v.heat || 0;

        ctx.fillStyle = `rgba(255,50,50,${Math.min(0.8, heat / 100)})`;
        ctx.beginPath();
        ctx.arc(v.x || 0, v.y || 0, 20 + heat * 0.1, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. overlay ReactFlow nodes (read-only visual merge)
      const nodes = reactFlowRef?.current?.getNodes?.() || [];

      nodes.forEach(n => {
        ctx.fillStyle = "rgba(0,200,255,0.6)";
        ctx.fillRect(n.position.x, n.position.y, 8, 8);
      });

      raf.current = requestAnimationFrame(render);
    };

    // WS ingestion
    if (ws) {
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          if (data.type === "FIELD_DIFF") {
            (data.updated || []).forEach(e => {
              field.set(e.id, e);
            });

            (data.added || []).forEach(e => {
              field.set(e.id, e);
            });
          }
        } catch (e) {}
      };
    }

    render();

    return () => cancelAnimationFrame(raf.current);
  }, [canvas, ws, reactFlowRef]);
}
