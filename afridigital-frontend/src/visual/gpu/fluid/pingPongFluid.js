/**
 * Ping-pong fluid simulation core (CPU-simplified version of GPU logic)
 * In real GPU version this maps to two framebuffer textures.
 */

export function createFluidSim(size = 128) {
  let current = new Float32Array(size * size);
  let previous = new Float32Array(size * size);

  function index(x, y) {
    return x + y * size;
  }

  function addDensity(x, y, amount) {
    const i = index(x, y);
    if (i >= 0 && i < current.length) {
      current[i] += amount;
    }
  }

  function step() {
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {

        const i = index(x, y);

        // diffusion (average neighbors)
        const sum =
          current[index(x - 1, y)] +
          current[index(x + 1, y)] +
          current[index(x, y - 1)] +
          current[index(x, y + 1)];

        const diffused = (sum * 0.25) * 0.98; // viscosity

        // shock persistence
        previous[i] = diffused;
      }
    }

    // swap buffers (PING-PONG)
    const temp = current;
    current = previous;
    previous = temp;
  }

  function getField() {
    return current;
  }

  return {
    addDensity,
    step,
    getField
  };
}
