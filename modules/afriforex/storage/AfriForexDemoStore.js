import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createTradingPreferences,
  createTradingAccount
} from "../contracts/AfriForexTradingContracts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../.data");
const DATA_FILE = path.join(DATA_DIR, "demo-state.json");

const DEFAULT_STATE = {
  version: "1.0",
  accounts: {},
  preferences: {},
  positions: {},
  history: []
};

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
  }
}

function readState() {
  ensureStore();

  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return {
      ...DEFAULT_STATE,
      ...parsed,
      accounts: parsed.accounts || {},
      preferences: parsed.preferences || {},
      positions: parsed.positions || {},
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function writeState(state) {
  ensureStore();

  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(state, null, 2));
  fs.renameSync(tempFile, DATA_FILE);

  return state;
}

const AfriForexDemoStore = {
  getAccount(customerId = "guest") {
    const state = readState();

    if (!state.accounts[customerId]) {
      state.accounts[customerId] = createTradingAccount({ customerId });
      writeState(state);
    }

    return state.accounts[customerId];
  },

  saveAccount(account) {
    const state = readState();
    state.accounts[account.customerId] = account;
    writeState(state);
    return account;
  },

  getPreferences(customerId = "guest") {
    const state = readState();

    if (!state.preferences[customerId]) {
      state.preferences[customerId] = createTradingPreferences({ customerId });
      writeState(state);
    }

    return state.preferences[customerId];
  },

  savePreferences(preferences) {
    const state = readState();
    state.preferences[preferences.customerId] = preferences;
    writeState(state);
    return preferences;
  },

  getOpenPositions(customerId = "guest") {
    const state = readState();

    return Object.values(state.positions).filter(
      position =>
        position.customerId === customerId &&
        position.status === "OPEN"
    );
  },

  savePosition(position) {
    const state = readState();
    state.positions[position.positionId] = position;
    writeState(state);
    return position;
  },

  closePosition(positionId, updates = {}) {
    const state = readState();
    const position = state.positions[positionId];

    if (!position) return null;

    const closed = {
      ...position,
      ...updates,
      status: "CLOSED",
      closedAt: updates.closedAt || new Date().toISOString()
    };

    state.positions[positionId] = closed;
    state.history.push(closed);
    writeState(state);

    return closed;
  },

  getHistory(customerId = "guest") {
    const state = readState();

    return state.history.filter(
      position => position.customerId === customerId
    );
  },

  snapshot() {
    return readState();
  }
};

export default AfriForexDemoStore;
