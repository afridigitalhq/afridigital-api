function guard(eventName) {
  if (!eventName || eventName === "unknown") {
    return {
      blocked: true,
      error: "KERNEL_LOCKED: Invalid event"
    };
  }

  return {
    allowed: true
  };
}

module.exports = guard;
