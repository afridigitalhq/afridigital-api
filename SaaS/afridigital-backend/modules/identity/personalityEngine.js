const profiles = new Map();

/**
 * Build or update user personality profile
 */
function updateProfile(userId, message, response) {
  if (!profiles.has(userId)) {
    profiles.set(userId, {
      tone: "neutral",
      interests: {},
      memoryTags: [],
      interactionCount: 0
    });
  }

  const profile = profiles.get(userId);

  profile.interactionCount += 1;

  // crude tone detection
  const lower = message.toLowerCase();

  if (lower.includes("bro") || lower.includes("brother")) profile.tone = "casual";
  if (lower.includes("urgent") || lower.includes("asap")) profile.tone = "direct";
  if (lower.includes("please") || lower.includes("kindly")) profile.tone = "polite";

  // interest tracking (lightweight signal extraction)
  if (lower.includes("whatsapp")) profile.interests.whatsapp = (profile.interests.whatsapp || 0) + 1;
  if (lower.includes("ai")) profile.interests.ai = (profile.interests.ai || 0) + 1;
  if (lower.includes("backend")) profile.interests.backend = (profile.interests.backend || 0) + 1;

  // memory tagging
  profile.memoryTags.push({
    message,
    response,
    ts: Date.now()
  });

  // limit memory size
  if (profile.memoryTags.length > 50) {
    profile.memoryTags.shift();
  }

  profiles.set(userId, profile);
  return profile;
}

/**
 * Inject personality into AI prompt
 */
function applyPersonality(userId, prompt) {
  const profile = profiles.get(userId);

  if (!profile) return prompt;

  let prefix = `User personality context:\n`;

  prefix += `Tone: ${profile.tone}\n`;
  prefix += `Interaction level: ${profile.interactionCount}\n`;

  prefix += `Key interests: ${Object.keys(profile.interests).join(", ")}\n\n`;

  return prefix + "User message: " + prompt;
}

module.exports = { updateProfile, applyPersonality };
