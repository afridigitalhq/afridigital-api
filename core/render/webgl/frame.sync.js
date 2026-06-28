let rafId = null;
let queue = null;

function scheduleFrame(updateFn) {
  queue = updateFn;

  if (!rafId) {
    const loop = () => {
      rafId = requestAnimationFrame(loop);

      if (queue) {
        queue();
        queue = null;
      }
    };

    rafId = requestAnimationFrame(loop);
  }
}

module.exports = { scheduleFrame };
