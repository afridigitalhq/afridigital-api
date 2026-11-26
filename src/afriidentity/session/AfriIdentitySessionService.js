import { createHash, randomBytes, randomUUID } from "node:crypto";

const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_TTL_MS = 24 * 60 * 60 * 1000;
const issuedPrincipals = new WeakSet();

function hashToken(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export class AfriIdentitySessionService {
  constructor({ repository, clock = Date.now, ttlMs = DEFAULT_TTL_MS } = {}) {
    if (!repository ||
        typeof repository.createSession !== "function" ||
        typeof repository.findActiveSessionByTokenHash !== "function" ||
        typeof repository.findActiveSessionById !== "function" ||
        typeof repository.findUserById !== "function" ||
        typeof repository.listUserRoles !== "function" ||
        typeof repository.revokeSession !== "function") {
      throw new Error("AFRI_IDENTITY_SESSION_REPOSITORY_REQUIRED");
    }
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 60000 || ttlMs > MAX_TTL_MS) {
      throw new Error("AFRI_IDENTITY_SESSION_TTL_INVALID");
    }
    this.repository = repository;
    this.clock = clock;
    this.ttlMs = ttlMs;
  }

  async create(userId, { auditEventId, throttleKey } = {}) {
    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("AFRI_IDENTITY_USER_ID_REQUIRED");
    }

    if (auditEventId !== undefined &&
        (typeof auditEventId !== "string" || !auditEventId.trim())) {
      throw new Error("AFRI_IDENTITY_AUDIT_ID_REQUIRED");
    }

    const user = await this.repository.findUserById(userId.trim());
    if (!user || user.status !== "ACTIVE") {
      throw new Error("AFRI_IDENTITY_USER_NOT_ACTIVE");
    }

    const token = randomBytes(32).toString("base64url");
    const createdAt = this.clock();
    const expiresAt = createdAt + this.ttlMs;
    const sessionInput = {
      sessionId: randomUUID(),
      userId: user.userId,
      tokenHash: hashToken(token),
      createdAt,
      expiresAt
    };

    let session;
    if (auditEventId !== undefined) {
      if (typeof this.repository.createSessionWithAudit !== "function") {
        throw new Error("AFRI_IDENTITY_AUDIT_SESSION_REPOSITORY_REQUIRED");
      }
      session = await this.repository.createSessionWithAudit({
        ...sessionInput,
        eventId: auditEventId.trim(),
        ...(throttleKey === undefined ? {} : { throttleKey })
      });
    } else {
      session = await this.repository.createSession(sessionInput);
    }

    return {
      token,
      sessionId: session.sessionId,
      expiresAt: session.expiresAt
    };
  }

  async authenticate(token) {
    if (typeof token !== "string" ||
        !/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;

    const session = await this.repository.findActiveSessionByTokenHash(
      hashToken(token),
      this.clock()
    );
    if (!session) return null;

    const user = await this.repository.findUserById(session.userId);
    if (!user || user.status !== "ACTIVE") return null;

    const roles = await this.repository.listUserRoles(user.userId);

    const principal = Object.freeze({
      userId: user.userId,
      email: user.email,
      roles: Object.freeze([...roles]),
      sessionId: session.sessionId
    });
    issuedPrincipals.add(principal);
    return principal;
  }

  async verifyPrincipal(principal) {
    if (!principal || typeof principal !== "object" || !issuedPrincipals.has(principal)) return null;
    if (typeof principal.userId !== "string" || typeof principal.sessionId !== "string") return null;
    const session = await this.repository.findActiveSessionById(principal.sessionId, this.clock());
    if (!session || session.userId !== principal.userId) return null;
    const user = await this.repository.findUserById(session.userId);
    if (!user || user.status !== "ACTIVE") return null;
    const roles = await this.repository.listUserRoles(user.userId);
    const verified = Object.freeze({
      userId: user.userId,
      email: user.email,
      roles: Object.freeze([...roles]),
      sessionId: session.sessionId
    });
    issuedPrincipals.add(verified);
    return verified;
  }

  async revoke(token) {
    if (typeof token !== "string" ||
        !/^[A-Za-z0-9_-]{40,60}$/.test(token)) return false;

    const session = await this.repository.findActiveSessionByTokenHash(
      hashToken(token),
      this.clock()
    );
    if (!session) return false;

    return Boolean(await this.repository.revokeSession(
      session.sessionId,
      this.clock()
    ));
  }
}

export default AfriIdentitySessionService;
