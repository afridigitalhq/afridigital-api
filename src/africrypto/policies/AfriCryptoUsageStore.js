import fs from "node:fs";
import path from "node:path";

const USAGE_DIR = path.resolve(process.cwd(), ".africrypto/usage");
const USAGE_FILE = path.join(USAGE_DIR, "daily.json");

let usageLock = Promise.resolve();

function ensureUsageDir() {
  fs.mkdirSync(USAGE_DIR, { recursive: true, mode: 0o700 });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readUsage() {
  if (!fs.existsSync(USAGE_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));
  } catch {
    throw new Error("AFRICRYPTO_USAGE_STORE_CORRUPTED");
  }
}

function writeUsage(usage) {
  ensureUsageDir();

  fs.writeFileSync(
    USAGE_FILE,
    `${JSON.stringify(usage, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

function withUsageLock(task) {
  const next = usageLock.then(task, task);
  usageLock = next.catch(() => {});
  return next;
}

function validateIdentity(walletId, networkId) {
  if (!walletId)
    throw new Error("AFRICRYPTO_USAGE_WALLET_ID_REQUIRED");

  if (!networkId)
    throw new Error("AFRICRYPTO_USAGE_NETWORK_ID_REQUIRED");
}

function validateAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount < 0)
    throw new Error("AFRICRYPTO_USAGE_INVALID_AMOUNT");

  return numericAmount;
}

export function getDailyUsage(walletId, networkId) {
  validateIdentity(walletId, networkId);

  const usage = readUsage();
  const day = todayKey();

  return Number(
    usage?.[day]?.[walletId]?.[networkId] ?? 0
  );
}

export function recordDailyUsage(walletId, networkId, amount) {
  validateIdentity(walletId, networkId);

  const numericAmount = validateAmount(amount);

  return withUsageLock(() => {
    const usage = readUsage();
    const day = todayKey();

    usage[day] ??= {};
    usage[day][walletId] ??= {};
    usage[day][walletId][networkId] ??= 0;

    usage[day][walletId][networkId] += numericAmount;

    writeUsage(usage);

    return usage[day][walletId][networkId];
  });
}

export function reserveDailyUsage(
  walletId,
  networkId,
  amount,
  dailyLimit
) {
  validateIdentity(walletId, networkId);

  const numericAmount = validateAmount(amount);
  const numericLimit = dailyLimit === null ? null : Number(dailyLimit);

  if (
    numericLimit !== null &&
    (!Number.isFinite(numericLimit) || numericLimit < 0)
  ) {
    throw new Error("AFRICRYPTO_USAGE_INVALID_DAILY_LIMIT");
  }

  return withUsageLock(() => {
    const usage = readUsage();
    const day = todayKey();

    usage[day] ??= {};
    usage[day][walletId] ??= {};
    usage[day][walletId][networkId] ??= 0;

    const currentUsage = Number(
      usage[day][walletId][networkId]
    );

    const nextUsage = currentUsage + numericAmount;

    if (
      numericLimit !== null &&
      nextUsage > numericLimit
    ) {
      const error = new Error(
        "AFRICRYPTO_USAGE_DAILY_LIMIT_EXCEEDED"
      );

      error.dailyUsage = currentUsage;
      error.dailyLimit = numericLimit;
      error.amount = numericAmount;

      throw error;
    }

    usage[day][walletId][networkId] = nextUsage;

    writeUsage(usage);

    return Object.freeze({
      walletId,
      networkId,
      day,
      amount: numericAmount,
      previousUsage: currentUsage,
      reservedUsage: nextUsage
    });
  });
}

export function releaseDailyUsage(reservation) {
  if (!reservation?.walletId)
    throw new Error("AFRICRYPTO_USAGE_RESERVATION_REQUIRED");

  validateIdentity(
    reservation.walletId,
    reservation.networkId
  );

  const numericAmount = validateAmount(reservation.amount);

  return withUsageLock(() => {
    const usage = readUsage();
    const day = reservation.day || todayKey();

    const currentUsage = Number(
      usage?.[day]?.[reservation.walletId]?.[reservation.networkId] ?? 0
    );

    const nextUsage = Math.max(
      0,
      currentUsage - numericAmount
    );

    usage[day] ??= {};
    usage[day][reservation.walletId] ??= {};
    usage[day][reservation.walletId][reservation.networkId] = nextUsage;

    writeUsage(usage);

    return nextUsage;
  });
}

export function listDailyUsage() {
  return readUsage();
}
