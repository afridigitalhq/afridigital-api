import React, { useEffect, useRef } from "react";

export default function DAGCanvas({ events }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = (events || []).slice(-20);

      nodes.forEach((n, i) => {
        const x = 100 + i * 30;
        const y = 100 + Math.sin(Date.now() / 500 + i) * 20;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffcc";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, [events]);

  return (
    <canvas
      ref={ref}
      width={window.innerWidth}
      height={window.innerHeight}
      className="absolute top-0 left-0 z-0"
    />
  );
}
