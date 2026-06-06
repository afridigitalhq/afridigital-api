import { buildEconomyProfile } from "../../core/ai/economy/brain";

export function generateFeed(items = [], userId = "guest") {
  const profile = buildEconomyProfile(userId);

  return items
    .map(item => {
      let score = item.baseScore || 1;

      if (profile.topIntent && item.category === profile.topIntent) {
        score += 100;
      }

      if (profile.frequency?.[item.category]) {
        score += profile.frequency[item.category] * 20;
      }

      if (profile.lastIntent === item.category) {
        score += 50;
      }

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
}
