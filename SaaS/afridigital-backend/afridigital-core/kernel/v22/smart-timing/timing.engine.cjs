function shouldShowAd(profile) {

  if (profile.clicks > 10 && profile.views < 5) return true;

  if (profile.earningsIntent > 3) return true;

  // reduce fatigue
  if (profile.views % 3 !== 0) return false;

  return true;
}

module.exports = { shouldShowAd };
