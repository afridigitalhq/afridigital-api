export function attachWebGLUpdate(renderer, getNodes) {
  function loop() {
    const nodes = getNodes ? getNodes() : [];
    if (renderer && renderer.update) {
      renderer.update(nodes);
    }
    requestAnimationFrame(loop);
  }

  loop();
}
