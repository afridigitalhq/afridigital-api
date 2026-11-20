export function createAfriIdentityAuthenticationMiddleware({ sessionService } = {}) {
  if (!sessionService || typeof sessionService.authenticate !== "function") {
    throw new Error("AFRI_IDENTITY_SESSION_SERVICE_REQUIRED");
  }

  return async function afriIdentityAuthentication(req, res, next) {
    const header = req.headers?.authorization;
    const match = typeof header === "string"
      ? /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(header)
      : null;

    if (!match) {
      return res.status(401).json({
        error: { code: "AFRI_IDENTITY_AUTHENTICATION_REQUIRED" }
      });
    }

    try {
      const principal = await sessionService.authenticate(match[1]);
      if (!principal) {
        return res.status(401).json({
          error: { code: "AFRI_IDENTITY_SESSION_INVALID" }
        });
      }

      req.auth = principal;
      return next();
    } catch {
      return res.status(503).json({
        error: { code: "AFRI_IDENTITY_AUTHENTICATION_UNAVAILABLE" }
      });
    }
  };
}

export default createAfriIdentityAuthenticationMiddleware;
