import { createAfriIdentityAuthenticationMiddleware } from "../../afriidentity/middleware/AfriIdentityAuthenticationMiddleware.js";
import { getAfriIdentityRuntime } from "../../afriidentity/bootstrap/index.js";

export const OLLAMA_DIAGNOSTICS_ROLE = "AFRIAI_DIAGNOSTICS_ADMIN";

export function createOllamaDiagnosticsAuthorization({
  getIdentityRuntime = getAfriIdentityRuntime
} = {}) {
  return function requireOllamaDiagnosticsAdmin(req, res, next) {
    let runtime;

    try {
      runtime = getIdentityRuntime();
    } catch {
      return res.status(503).json({
        error: { code: "AFRI_IDENTITY_RUNTIME_UNAVAILABLE" }
      });
    }

    if (!runtime?.sessionService ||
        typeof runtime.sessionService.verifyPrincipal !== "function") {
      return res.status(503).json({
        error: { code: "AFRI_IDENTITY_AUTHENTICATION_UNAVAILABLE" }
      });
    }

    let authenticate;

    try {
      authenticate = createAfriIdentityAuthenticationMiddleware({
        sessionService: runtime.sessionService
      });
    } catch {
      return res.status(503).json({
        error: { code: "AFRI_IDENTITY_AUTHENTICATION_UNAVAILABLE" }
      });
    }

    return authenticate(req, res, () => {
      Promise.resolve()
        .then(() => runtime.sessionService.verifyPrincipal(req.auth))
        .then(principal => {
          if (!principal) {
            return res.status(401).json({
              error: { code: "AFRI_IDENTITY_PRINCIPAL_INVALID" }
            });
          }

          if (!Array.isArray(principal.roles) ||
              !principal.roles.includes(OLLAMA_DIAGNOSTICS_ROLE)) {
            return res.status(403).json({
              error: { code: "AFRIAI_DIAGNOSTICS_FORBIDDEN" }
            });
          }

          req.ollamaDiagnosticsPrincipal = principal;
          return next();
        })
        .catch(() => res.status(503).json({
          error: { code: "AFRI_IDENTITY_VERIFICATION_UNAVAILABLE" }
        }));
    });
  };
}
