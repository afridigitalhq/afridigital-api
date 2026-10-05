import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CREDENTIAL_DIR = path.resolve(process.cwd(), ".africrypto/credentials");
const CREDENTIAL_FILE = path.join(CREDENTIAL_DIR, "managed-custody.enc");

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function requireValue(value, code) {
  if (!value) throw new Error(code);
  return value;
}

function ensureCredentialDirectory() {
  fs.mkdirSync(CREDENTIAL_DIR, {
    recursive: true,
    mode: 0o700
  });
}

function deriveKey(secret) {
  return crypto
    .createHash("sha256")
    .update(String(secret), "utf8")
    .digest();
}

function resolveDevelopmentMasterSecret() {
  const secret = process.env.AFRICRYPTO_CUSTODY_MASTER_SECRET;

  if (!secret) {
    throw new Error("AFRICRYPTO_CUSTODY_MASTER_SECRET_REQUIRED");
  }

  return secret;
}

function encryptCredential(walletId, credential) {
  const masterKey = deriveKey(resolveDevelopmentMasterSecret());
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH
  });

  cipher.setAAD(Buffer.from(walletId, "utf8"));

  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(credential, "utf8")),
    cipher.final()
  ]);

  return {
    version: 1,
    algorithm: ALGORITHM,
    walletId,
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64")
  };
}

function decryptCredential(record) {
  const masterKey = deriveKey(resolveDevelopmentMasterSecret());

  const decipher = crypto.createDecipheriv(
    record.algorithm,
    masterKey,
    Buffer.from(record.iv, "base64"),
    { authTagLength: AUTH_TAG_LENGTH }
  );

  decipher.setAAD(Buffer.from(record.walletId, "utf8"));
  decipher.setAuthTag(Buffer.from(record.authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(record.ciphertext, "base64")),
    decipher.final()
  ]).toString("utf8");
}

function readRecords() {
  if (!fs.existsSync(CREDENTIAL_FILE)) return {};

  const parsed = JSON.parse(
    fs.readFileSync(CREDENTIAL_FILE, "utf8")
  );

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AFRICRYPTO_CREDENTIAL_STORE_INVALID");
  }

  return parsed;
}

function writeRecords(records) {
  ensureCredentialDirectory();

  const temporaryFile =
    `${CREDENTIAL_FILE}.${process.pid}.${Date.now()}.tmp`;

  fs.writeFileSync(
    temporaryFile,
    `${JSON.stringify(records, null, 2)}\n`,
    {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx"
    }
  );

  fs.renameSync(temporaryFile, CREDENTIAL_FILE);
  fs.chmodSync(CREDENTIAL_FILE, 0o600);
}

const AfriCryptoCustodyCredentialStore = {
  provision(walletId, credential) {
    requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");
    requireValue(
      credential,
      "AFRICRYPTO_CUSTODY_CREDENTIAL_REQUIRED"
    );

    const records = readRecords();

    if (records[walletId]) {
      throw new Error("AFRICRYPTO_CUSTODY_CREDENTIAL_ALREADY_EXISTS");
    }

    records[walletId] = encryptCredential(
      walletId,
      String(credential)
    );

    writeRecords(records);

    return {
      walletId,
      status: "CREDENTIAL_PROVISIONED"
    };
  },

  resolve(walletId) {
    requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");

    const records = readRecords();
    const record = records[walletId];

    if (!record) {
      throw new Error(
        "AFRICRYPTO_CUSTODY_CREDENTIAL_NOT_FOUND"
      );
    }

    return decryptCredential(record);
  },

  has(walletId) {
    if (!walletId) return false;
    return Boolean(readRecords()[walletId]);
  },

  remove(walletId) {
    requireValue(walletId, "AFRICRYPTO_WALLET_ID_REQUIRED");

    const records = readRecords();

    if (!records[walletId]) {
      throw new Error(
        "AFRICRYPTO_CUSTODY_CREDENTIAL_NOT_FOUND"
      );
    }

    delete records[walletId];
    writeRecords(records);

    return {
      walletId,
      status: "CREDENTIAL_REMOVED"
    };
  },

  health() {
    return {
      service: "AfriCryptoCustodyCredentialStore",
      mode: "LOCAL_ENCRYPTED_DEVELOPMENT",
      credentialDirectory: ".africrypto/credentials",
      persistent: fs.existsSync(CREDENTIAL_FILE),
      status: "healthy"
    };
  }
};

export default AfriCryptoCustodyCredentialStore;
