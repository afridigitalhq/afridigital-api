function freezeKernelSurface(kernel) {
  if (!kernel) return kernel;

  ["dispatch","emit","execute"].forEach(k => {
    if (kernel[k]) {
      Object.defineProperty(kernel, k, {
        value: kernel[k],
        writable: false,
        configurable: false
      });
    }
  });

  return Object.freeze(kernel);
}

module.exports = { freezeKernelSurface };
