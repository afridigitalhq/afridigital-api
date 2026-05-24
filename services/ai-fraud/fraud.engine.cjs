function detect(activity) {
  if (!activity) return false;

  const suspicious =
    activity.clicks > 1000 ||
    activity.sameIp === true ||
    activity.botLike === true;

  if (suspicious) {
    console.log("🚨 Fraud Detected");
    return true;
  }

  return false;
}

module.exports = { detect };
