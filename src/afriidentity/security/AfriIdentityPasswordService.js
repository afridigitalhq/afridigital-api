import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const VERSION = "scrypt";
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MAXMEM = 64 * 1024 * 1024;
const MAX_PASSWORD_LENGTH = 1024;

function validatePassword(password) {
  if (typeof password !== "string" ||
      password.length < 12 ||
      password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("AFRI_IDENTITY_PASSWORD_INVALID");
  }
}

export class AfriIdentityPasswordService {
  static async hash(password) {
    validatePassword(password);
    const salt = randomBytes(SALT_LENGTH);
    const derived = await scrypt(password, salt, KEY_LENGTH, {
      N: COST,
      r: BLOCK_SIZE,
      p: PARALLELIZATION,
      maxmem: MAXMEM
    });

    return [
      VERSION,
      COST,
      BLOCK_SIZE,
      PARALLELIZATION,
      salt.toString("hex"),
      Buffer.from(derived).toString("hex")
    ].join("$");
  }

  static async verify(password, encodedHash) {
    if (typeof password !== "string" ||
        password.length > MAX_PASSWORD_LENGTH ||
        typeof encodedHash !== "string" ||
        encodedHash.length > 512) {
      return false;
    }

    const parts = encodedHash.split("$");
    if (parts.length !== 6 || parts[0] !== VERSION) return false;

    const [, n, r, p, saltHex, keyHex] = parts;
    if (n !== String(COST) ||
        r !== String(BLOCK_SIZE) ||
        p !== String(PARALLELIZATION) ||
        !/^[a-f0-9]{32}$/i.test(saltHex) ||
        !/^[a-f0-9]{128}$/i.test(keyHex)) {
      return false;
    }

    try {
      const expected = Buffer.from(keyHex, "hex");
      const actual = Buffer.from(await scrypt(
        password,
        Buffer.from(saltHex, "hex"),
        KEY_LENGTH,
        {
          N: COST,
          r: BLOCK_SIZE,
          p: PARALLELIZATION,
          maxmem: MAXMEM
        }
      ));
      return expected.length === actual.length &&
        timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }
}

export default AfriIdentityPasswordService;
