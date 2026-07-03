export const featureFlags = {
  afrivision: true,
  afrisports: true,
  afrimeta: true
};

export function getFeatureFlags(req, res) {
  res.json({ flags: featureFlags });
}
