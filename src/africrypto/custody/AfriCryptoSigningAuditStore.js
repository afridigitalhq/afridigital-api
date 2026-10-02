import fs from "node:fs";
import path from "node:path";

const AUDIT_DIR = path.resolve(process.cwd(), ".africrypto/audit");
const AUDIT_FILE = path.join(AUDIT_DIR, "signing.jsonl");

function ensureAuditDir() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true, mode: 0o700 });
}

function sanitize(record) {
  return Object.freeze({
    requestId: record.requestId,
    walletId: record.walletId,
    networkId: record.networkId,
    environment: record.environment,
    from: record.from || null,
    to: record.to || null,
    value: record.value ?? null,
    status: record.status,
    reason: record.reason || null,
    createdAt: record.createdAt || new Date().toISOString()
  });
}

export function recordSigningAudit(record) {
  if (!record?.requestId) {
    throw new Error("AFRICRYPTO_AUDIT_REQUEST_ID_REQUIRED");
  }

  ensureAuditDir();

  const entry = sanitize(record);

  fs.appendFileSync(
    AUDIT_FILE,
    `${JSON.stringify(entry)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );

  return entry;
}

export function listSigningAudits() {
  if (!fs.existsSync(AUDIT_FILE)) return [];

  return fs.readFileSync(AUDIT_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}
