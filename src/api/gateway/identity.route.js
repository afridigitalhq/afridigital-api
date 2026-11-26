import {
  createHash,
  randomBytes,
  randomUUID,
  timingSafeEqual
} from "node:crypto";
import { getAfriIdentityRuntime } from "../../afriidentity/bootstrap/index.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

function validBody(body) {
  return body && typeof body === "object" && !Array.isArray(body);
}

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

function hashThrottleKey(email) {
  return createHash("sha256").update(email, "utf8").digest("hex");
}

function bootstrapSecretMatches(supplied, configured) {
  if (typeof supplied !== "string" || !supplied || typeof configured !== "string" || !configured) {
    return false;
  }
  const suppliedDigest = createHash("sha256").update(supplied, "utf8").digest();
  const configuredDigest = createHash("sha256").update(configured, "utf8").digest();
  return timingSafeEqual(suppliedDigest, configuredDigest);
}

export default function identityRoute(app, {
  getIdentityRuntime = getAfriIdentityRuntime,
  getBootstrapSecret = () => process.env.AFRI_IDENTITY_BOOTSTRAP_SECRET,
  getRecoverySecret = () => process.env.AFRI_IDENTITY_RECOVERY_SECRET
} = {}) {
  let dummyHashPromise;

  app.post("/api/identity/bootstrap-admin", async (req, res) => {
    const configuredSecret = getBootstrapSecret();
    const suppliedSecret = typeof req.get === "function"
      ? req.get("x-afri-bootstrap-secret")
      : req.headers?.["x-afri-bootstrap-secret"];

    if (!bootstrapSecretMatches(suppliedSecret, configuredSecret)) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (!validBody(req.body)) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    if (!email || typeof password !== "string" ||
        password.length < 12 || password.length > 1024) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    try {
      const runtime = getIdentityRuntime();
      const passwordHash = await runtime.passwordService.constructor.hash(password);
      const user = await runtime.repository.createInitialAdminWithAudit({
        userId: randomUUID(),
        email,
        passwordHash,
        eventId: randomUUID()
      });

      return res.status(201).json({
        status: "INITIAL_ADMIN_CREATED",
        user: { userId: user.userId, email: user.email }
      });
    } catch (error) {
      if (error?.message === "AFRI_IDENTITY_BOOTSTRAP_ALREADY_COMPLETED") {
        return res.status(409).json({ error: "BOOTSTRAP_ALREADY_COMPLETED" });
      }
      if (error?.message === "AFRI_IDENTITY_PASSWORD_INVALID" ||
          error?.message === "AFRI_IDENTITY_EMAIL_INVALID") {
        return res.status(400).json({ error: "INVALID_REQUEST" });
      }
      return res.status(503).json({ error: "IDENTITY_SERVICE_UNAVAILABLE" });
    }
  });


  app.post("/api/identity/recover-initial-admin", async (req, res) => {
    const configuredSecret = getRecoverySecret();
    const suppliedSecret = typeof req.get === "function"
      ? req.get("x-afri-recovery-secret")
      : req.headers?.["x-afri-recovery-secret"];

    if (typeof configuredSecret !== "string" ||
        configuredSecret.length < 43 ||
        !bootstrapSecretMatches(suppliedSecret, configuredSecret)) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (!validBody(req.body)) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    if (!email ||
        typeof password !== "string" ||
        password.length < 12 ||
        password.length > 1024 ||
        typeof passwordConfirmation !== "string" ||
        passwordConfirmation !== password) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    try {
      const runtime = getIdentityRuntime();
      const passwordHash = await runtime.passwordService.constructor.hash(password);
      const recoveryKeyHash = createHash("sha256")
        .update(configuredSecret, "utf8")
        .digest("hex");

      const user = await runtime.repository.recoverInitialAdminPasswordWithAudit({
        email,
        passwordHash,
        recoveryKeyHash,
        eventId: randomUUID()
      });

      return res.status(200).json({
        status: "ADMIN_PASSWORD_RECOVERED",
        user: { userId: user.userId, email: user.email }
      });
    } catch (error) {
      if (error?.message === "AFRI_IDENTITY_RECOVERY_ALREADY_USED") {
        return res.status(409).json({ error: "RECOVERY_ALREADY_USED" });
      }
      if (error?.message === "AFRI_IDENTITY_RECOVERY_ADMIN_NOT_FOUND") {
        return res.status(404).json({ error: "ADMIN_NOT_FOUND" });
      }
      if (error?.message === "AFRI_IDENTITY_EMAIL_INVALID" ||
          error?.message === "AFRI_IDENTITY_PASSWORD_HASH_INVALID") {
        return res.status(400).json({ error: "INVALID_REQUEST" });
      }
      return res.status(503).json({ error: "IDENTITY_SERVICE_UNAVAILABLE" });
    }
  });

  app.post("/api/identity/login", async (req, res) => {
    if (!validBody(req.body)) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    if (!email || typeof password !== "string" || password.length > 1024) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    try {
      const runtime = getIdentityRuntime();
      const repository = runtime.repository;
      const throttleKey = hashThrottleKey(email);
      const now = Date.now();

      const initialThrottle = await repository.checkLoginThrottle({
        throttleKey,
        now,
        windowMs: LOGIN_WINDOW_MS
      });
      if (!initialThrottle.allowed) {
        return res.status(429).json({ error: "LOGIN_TEMPORARILY_BLOCKED" });
      }

      const user = await repository.findUserByEmail(email);
      const PasswordService = runtime.passwordService.constructor;

      if (!dummyHashPromise) {
        dummyHashPromise = PasswordService.hash(randomBytes(32).toString("hex"));
      }
      const dummyHash = user?.passwordHash || await dummyHashPromise;
      const passwordValid = await PasswordService.verify(password, dummyHash);

      if (!user || user.status !== "ACTIVE" || !passwordValid) {
        const failure = await repository.recordLoginFailure({
          throttleKey,
          now: Date.now(),
          windowMs: LOGIN_WINDOW_MS,
          maxAttempts: LOGIN_MAX_ATTEMPTS,
          blockMs: LOGIN_BLOCK_MS
        });
        return res.status(failure.allowed ? 401 : 429).json({
          error: failure.allowed
            ? "CREDENTIALS_INVALID"
            : "LOGIN_TEMPORARILY_BLOCKED"
        });
      }

      const finalThrottle = await repository.checkLoginThrottle({
        throttleKey,
        now: Date.now(),
        windowMs: LOGIN_WINDOW_MS
      });
      if (!finalThrottle.allowed) {
        return res.status(429).json({ error: "LOGIN_TEMPORARILY_BLOCKED" });
      }

      const roles = await repository.listUserRoles(user.userId);
      const session = await runtime.sessionService.create(user.userId, {
        auditEventId: randomUUID(),
        throttleKey
      });

      return res.status(200).json({
        token: session.token,
        expiresAt: session.expiresAt,
        user: {
          userId: user.userId,
          email: user.email,
          roles
        }
      });
    } catch {
      return res.status(503).json({ error: "IDENTITY_SERVICE_UNAVAILABLE" });
    }
  });
}
