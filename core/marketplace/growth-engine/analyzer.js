function analyzeMarket({ jobs = [], services = [] }) {

  const demand = {};
  const supply = {};

  jobs.forEach(j => {
    demand[j.category] = (demand[j.category] || 0) + 1;
  });

  services.forEach(s => {
    supply[s.category] = (supply[s.category] || 0) + 1;
  });

  return { demand, supply };
}
