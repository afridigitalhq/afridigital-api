function enhance(p) {

  const scoreBase = p.score ?? 0;

  const dbBoost =
    (p.db?.mongo === "ONLINE" ? 10 : 0) +
    (p.db?.redis === "ONLINE" ? 10 : 0) +
    (p.db?.postgres === "ONLINE" ? 10 : 0);

  const infraBoost =
    (p.infra?.servers?.active ? 5 : 0) +
    (p.infra?.latency === 0 ? 5 : 0);

  const metaBoost =
    (p.meta?.integrity ? Math.min(10, p.meta.integrity / 10) : 0);

  const snapshotBoost =
    (p.snapshots?.total > 0 ? 5 : 0);

  const finalScore = Math.min(100,
    scoreBase + dbBoost + infraBoost + metaBoost + snapshotBoost
  );

  return {
    ...p,
    score: finalScore,
    state: finalScore < 40 ? "CRITICAL"
          : finalScore < 70 ? "DEGRADED"
          : "STABLE",

    observatory: {
      dbBoost,
      infraBoost,
      metaBoost,
      snapshotBoost
    }
  };
}

module.exports = enhance;
