function computePhysics(event) {
  const heat = (event.score || 0) * 10;
  const velocity = event.status === "critical" ? 3 : 1;
  const mass = 1 + (event.score || 0);

  return { heat, velocity, mass };
}

module.exports = { computePhysics };
