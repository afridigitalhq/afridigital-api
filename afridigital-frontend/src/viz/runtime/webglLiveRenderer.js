export function bindWebGLLive(canvasRef, getNodes) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function frame() {
    const nodes = getNodes?.() || [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((n, i) => {
      const x = 100 + i * 70;
      const y = 120 + Math.sin(Date.now() / 400 + i) * 25;

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);

      ctx.fillStyle =
        n.status === "FAILED" ? "#ff3355" :
        n.status === "DEGRADED" ? "#ffaa33" :
        "#33ff99";

      ctx.fill();

      ctx.fillStyle = "#aaa";
      ctx.fillText(n.id || "node", x - 10, y - 15);
    });

    requestAnimationFrame(frame);
  }

  frame();
}
