import { computeHealth } from "./metrics";

export function buildHealthStream(events) {
  const windowSize = 50;
  const stream = [];

  for (let i = 1; i <= events.length; i++) {
    const window = events.slice(Math.max(0, i - windowSize), i);

    stream.push({
      index: i,
      health: computeHealth(window)
    });
  }

  return stream;
}
