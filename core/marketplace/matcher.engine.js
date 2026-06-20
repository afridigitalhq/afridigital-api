const bus = require('../eventbus');

function scoreMatch(user, item, type) {

  let score = 0;

  // BASIC SIGNALS (v1 heuristic scoring)
  if (type === "job") {
    if (user.skills?.length && item.skills?.length) {
      const overlap = item.skills.filter(s =>
        user.skills.includes(s)
      ).length;

      score = overlap / (item.skills.length || 1);
    }
  }

  if (type === "earn") {
    score = item.value ? Math.min(item.value / 10, 1) : 0.3;
  }

  if (type === "service") {
    score = item.rating ? item.rating / 5 : 0.5;
  }

  return {
    matchScore: Math.min(score, 1),
    confidence: 0.7,
    reason: `${type.toUpperCase()} match computed`
  };
}

function matchUser(user, jobs = [], earn = [], services = []) {

  const results = {
    jobs: jobs.map(j => ({ ...j, ...scoreMatch(user, j, "job") })),
    earn: earn.map(e => ({ ...e, ...scoreMatch(user, e, "earn") })),
    services: services.map(s => ({ ...s, ...scoreMatch(user, s, "service") }))
  };

  bus.emit("MARKETPLACE_MATCHED", {
    userId: user.id,
    results
  });

  return results;
}

module.exports = { matchUser };
