export const WindowMotion = {
  ease: "cubic-bezier(0.2, 0.9, 0.2, 1)",

  animate(window) {
    return {
      transition: "all 0.25s cubic-bezier(0.2, 0.9, 0.2, 1)",
      transform: `translate(${window.x}px, ${window.y}px)`
    };
  }
};
