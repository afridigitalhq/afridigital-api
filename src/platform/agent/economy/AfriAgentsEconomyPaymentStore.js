import fs from "node:fs";
import path from "node:path";

const ECONOMY_DIR = path.resolve(process.cwd(), ".afriagents/economy");
const PAYMENT_FILE = path.join(ECONOMY_DIR, "payments.json");

function ensureDir() {
  fs.mkdirSync(ECONOMY_DIR, { recursive: true, mode: 0o700 });
}

function readPayments() {
  if (!fs.existsSync(PAYMENT_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PAYMENT_FILE, "utf8"));
  } catch {
    throw new Error("AFRI_ECONOMY_PAYMENT_STORE_CORRUPTED");
  }
}

function writePayments(payments) {
  ensureDir();
  fs.writeFileSync(
    PAYMENT_FILE,
    `${JSON.stringify(payments, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

const AfriAgentsEconomyPaymentStore = {
  get(paymentId) {
    if (!paymentId) throw new Error("AFRI_ECONOMY_PAYMENT_ID_REQUIRED");
    return readPayments()[paymentId] || null;
  },

  list() {
    return Object.values(readPayments());
  },

  save(payment) {
    if (!payment?.paymentId) {
      throw new Error("AFRI_ECONOMY_PAYMENT_ID_REQUIRED");
    }
    const payments = readPayments();
    payments[payment.paymentId] = payment;
    writePayments(payments);
    return payment;
  }
};

export default AfriAgentsEconomyPaymentStore;
