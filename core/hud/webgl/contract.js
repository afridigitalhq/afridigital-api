function normalize(event) {
  return {
    id: event.id || Date.now(),
    node: event.type,
    state: event.state || "UNKNOWN",
    intensity: event.state === "CI_FAILED" ? 1 : 0.5,
    color:
      event.state === "CI_PASSED" ? "green" :
      event.state === "CI_FAILED" ? "red" :
      event.state === "CI_RUNNING" ? "blue" : "gray",
    links: event.links || [],
    meta: event
  };
}

module.exports = { normalize };
