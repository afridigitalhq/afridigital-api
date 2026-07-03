/* AFRIDIGITAL FEATURE FLAGS — CONTROL PLANE */

export const getLandingFeatureFlags = async (req, res) => {
  try {
    const flags = {
      hero: true,
      enterprise: true,
      afrivision: true,
      afrisports: true,
      afrimeta: true,
      ecosystem: true,
      commanddock: true,
      footer: true
    };

    return res.status(200).json({
      success: true,
      source: "afridigital-api",
      flags
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Feature flag service error"
    });
  }
};
