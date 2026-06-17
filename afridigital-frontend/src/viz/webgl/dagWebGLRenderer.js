export function initWebGLDag(canvas, nodes = []) {
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((n, i) => {
      const x = 100 + i * 80;
      const y = 100 + Math.sin(Date.now() / 500 + i) * 20;

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);

      ctx.fillStyle =
        n.status === "OK" ? "#00ff88" :
        n.status === "FAILED" ? "#ff3366" :
        "#ffaa00";

      ctx.fill();
      ctx.fillStyle = "#ccc";
      ctx.fillText(n.id, x - 10, y - 15);
    });

    requestAnimationFrame(draw);
  }

  draw();
}
