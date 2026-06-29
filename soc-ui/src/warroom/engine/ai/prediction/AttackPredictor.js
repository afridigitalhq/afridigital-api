export class AttackPredictor {
  predict(nodes) {
    const risky = nodes
      .map(n => ({
        ...n,
        score: (n.stress || Math.random()) * 100
      }))
      .sort((a, b) => b.score - a.score);

    return {
      nextTarget: risky[0],
      confidence: Math.random() * 100,
      chain: risky.slice(0, 3)
    };
  }
}
