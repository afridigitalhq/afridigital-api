export class AnomalyExplosions {
  trigger(level = 1) {
    return {
      particles: level * 50,
      shockwave: true,
      glow: "red",
      duration: 1200
    };
  }
}
