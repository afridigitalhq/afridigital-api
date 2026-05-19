/**
 * 🔮 PREDICTIVE RISK ENGINE (A3.10)
 */

function predictRisk(signals) {
  const last = signals.slice(-20);

  let routeStress = 0;
  let execSpike = 0;

  last.forEach(s => {
    if (s.type === "ROUTE") routeStress++;
    if (s.type === "EXECUTE") execSpike++;
  });

  const risk =
    (routeStress > 10 ? 0.4 : 0) +
    (execSpike > 10 ? 0.4 : 0) +
    (signals.length > 150 ? 0.2 : 0);

  return {
    score: Math.min(risk, 1),
    forecast:
      risk > 0.7 ? "SYSTEM_OVERLOAD" :
      risk > 0.4 ? "DEGRADING" : "STABLE"
  };
}

module.exports = { predictRisk };
