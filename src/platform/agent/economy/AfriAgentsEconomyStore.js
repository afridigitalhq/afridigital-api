import fs from "node:fs";
import path from "node:path";

const ECONOMY_DIR = path.resolve(process.cwd(), ".afriagents/economy");
const COUPON_FILE = path.join(ECONOMY_DIR, "coupons.json");
const SERVICE_FILE = path.join(ECONOMY_DIR, "services.json");

function ensureEconomyDir() {
  fs.mkdirSync(ECONOMY_DIR, { recursive: true, mode: 0o700 });
}

function readCoupons() {
  if (!fs.existsSync(COUPON_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(COUPON_FILE, "utf8"));
  } catch {
    throw new Error("AFRI_ECONOMY_COUPON_STORE_CORRUPTED");
  }
}

function writeCoupons(coupons) {
  ensureEconomyDir();

  fs.writeFileSync(
    COUPON_FILE,
    `${JSON.stringify(coupons, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

function readServices() {
  if (!fs.existsSync(SERVICE_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(SERVICE_FILE, "utf8"));
  } catch {
    throw new Error("AFRI_ECONOMY_SERVICE_STORE_CORRUPTED");
  }
}

function writeServices(services) {
  ensureEconomyDir();

  fs.writeFileSync(
    SERVICE_FILE,
    `${JSON.stringify(services, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

const AfriAgentsEconomyStore = {

  listServices() {
    return Object.values(readServices());
  },

  getService(key) {
    if (!key) {
      throw new Error("AFRI_ECONOMY_SERVICE_KEY_REQUIRED");
    }

    return readServices()[key] || null;
  },

  saveService(key, service) {
    if (!key) {
      throw new Error("AFRI_ECONOMY_SERVICE_KEY_REQUIRED");
    }

    if (!service || typeof service !== "object") {
      throw new Error("AFRI_ECONOMY_SERVICE_REQUIRED");
    }

    const services = readServices();

    services[key] = service;

    writeServices(services);

    return service;
  },

  removeService(key) {
    if (!key) {
      throw new Error("AFRI_ECONOMY_SERVICE_KEY_REQUIRED");
    }

    const services = readServices();

    if (!services[key]) return null;

    const removed = services[key];

    delete services[key];

    writeServices(services);

    return removed;
  },

  listCoupons() {
    return Object.values(readCoupons());
  },

  getCoupon(code) {
    if (!code) {
      throw new Error("AFRI_ECONOMY_COUPON_CODE_REQUIRED");
    }

    return readCoupons()[code] || null;
  },

  saveCoupon(coupon) {
    if (!coupon?.code) {
      throw new Error("AFRI_ECONOMY_COUPON_CODE_REQUIRED");
    }

    const coupons = readCoupons();

    coupons[coupon.code] = coupon;

    writeCoupons(coupons);

    return coupon;
  },

  removeCoupon(code) {
    if (!code) {
      throw new Error("AFRI_ECONOMY_COUPON_CODE_REQUIRED");
    }

    const coupons = readCoupons();

    if (!coupons[code]) return null;

    const removed = coupons[code];

    delete coupons[code];

    writeCoupons(coupons);

    return removed;
  }

};

export default AfriAgentsEconomyStore;
