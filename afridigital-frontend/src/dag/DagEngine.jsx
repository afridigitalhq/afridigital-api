import React, { useEffect, useRef } from "react";

export default function DagEngine({ events }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = new Map();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // background grid (cyberpunk feel)
      ctx.strokeStyle = "#111";
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // nodes
      nodes.forEach((node, id) => {
        ctx.fillStyle =
          node.status === "SUCCESS"
            ? "#00ff88"
            : node.status === "FAILED"
            ? "#ff3b3b"
            : node.status === "EXECUTING"
            ? "#00c2ff"
            : "#2a2a2a";

        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#aaa";
        ctx.fillText(id, node.x + 15, node.y + 5);
      });

      requestAnimationFrame(render);
    }

    render();

    // apply incoming events
    events.forEach((e) => {
      if (e.type === "NODE_UPDATE") {
        nodes.set(e.node, {
          x: e.x || Math.random() * canvas.width,
          y: e.y || Math.random() * canvas.height,
          status: e.status
        });
      }
    });
  }, [events]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "#05060a"
      }}
    />
  );
}
