function addPhysics(event) {
  const score = event.score || 0;

  return {
    ...event,
    physics: {
      heat: score * 10,
      velocity: event.status === "critical" ? 3 : 1,
      mass: 1 + score
    }
  };
}

module.exports = { addPhysics };
