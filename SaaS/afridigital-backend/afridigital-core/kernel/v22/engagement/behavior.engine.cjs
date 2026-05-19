const profiles = new Map();

function updateBehavior(userId, event) {

  const profile = profiles.get(userId) || {
    clicks: 0,
    views: 0,
    earningsIntent: 0,
    categories: {}
  };

  profile.views++;

  if (event.clicked) profile.clicks++;
  if (event.type === "job") profile.earningsIntent++;

  profile.categories[event.category] =
    (profile.categories[event.category] || 0) + 1;

  profiles.set(userId, profile);

  return profile;
}

module.exports = { updateBehavior };
