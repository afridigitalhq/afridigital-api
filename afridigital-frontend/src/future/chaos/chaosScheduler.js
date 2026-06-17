export function scheduleChaosTests() {
  const schedule = [
    {
      test: "LATENCY_SPIKE_SIMULATION",
      interval: "5m",
      safe: true
    },
    {
      test: "NODE_ISOLATION_SIMULATION",
      interval: "15m",
      safe: true
    },
    {
      test: "TRAFFIC_STORM_SIMULATION",
      interval: "30m",
      safe: true
    },
    {
      test: "REGION_DISCONNECT_SIMULATION",
      interval: "60m",
      safe: true
    }
  ];

  return {
    scheduler: schedule,
    mode: "SIMULATION_ONLY",
    safety: "NO_PRODUCTION_IMPACT"
  };
}
