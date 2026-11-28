import { createHash, timingSafeEqual } from "node:crypto";
import { getAfriIdentityRuntime } from "../../afriidentity/bootstrap/index.js";

const TARGET_EMAIL = "afridigitalhq@gmail.com";
const HASH_PATTERN = /^scrypt\$16384\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/i;

function secretMatches(supplied, configured) {
  if (typeof supplied !== "string" || !supplied ||
      typeof configured !== "string" || configured.length < 43) return false;
  const a = createHash("sha256").update(supplied, "utf8").digest();
  const b = createHash("sha256").update(configured, "utf8").digest();
  return timingSafeEqual(a, b);
}

export default function identityAdminDiagnosticRoute(app, {
  getIdentityRuntime = getAfriIdentityRuntime,
  getRecoverySecret = () => process.env.AFRI_IDENTITY_RECOVERY_SECRET
} = {}) {
  app.post("/api/identity/admin-account-diagnostic", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");

    const configuredSecret = getRecoverySecret();
    if (typeof configuredSecret !== "string" || configuredSecret.length < 43) {
      return res.status(503).json({ status: "DIAGNOSTIC_SECRET_NOT_CONFIGURED" });
    }

    const suppliedSecret = req.get("x-afri-identity-diagnostic-secret");
    if (!secretMatches(suppliedSecret, configuredSecret)) {
      return res.status(404).json({ status: "NOT_FOUND" });
    }

    try {
      const runtime = getIdentityRuntime();
      const user = await runtime.repository.findUserByEmail(TARGET_EMAIL);

      if (!user) {
        return res.json({
          status: "INSPECTED",
          account: "NOT_FOUND",
          accountStatus: null,
          passwordHashFormat: null,
          diagnosticsAdminRole: false
        });
      }

      const roles = await runtime.repository.listUserRoles(user.userId);

      return res.json({
        status: "INSPECTED",
        account: "FOUND",
        accountStatus: user.status ?? "UNKNOWN",
        passwordHashFormat: HASH_PATTERN.test(user.passwordHash || "")
          ? "CURRENT_SCRYPT_FORMAT"
          : "UNSUPPORTED_OR_INVALID_FORMAT",
        diagnosticsAdminRole: Array.isArray(roles) &&
          roles.includes("AFRIAI_DIAGNOSTICS_ADMIN")
      });
    } catch {
      return res.status(503).json({ status: "IDENTITY_DIAGNOSTIC_UNAVAILABLE" });
    }
  });
}
