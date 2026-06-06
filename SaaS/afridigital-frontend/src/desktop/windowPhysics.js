export const WindowPhysics = {
  snapGrid: 20,

  snap(value) {
    return Math.round(value / this.snapGrid) * this.snapGrid;
  },

  move(window, x, y) {
    return {
      ...window,
      x: this.snap(x),
      y: this.snap(y)
    };
  }
};
