import fs from "fs";
import { globalState } from "../state/globalState.js";

const FILE = "./snapshots.json";

function saveSnapshot(state) {
  try {
    const existing = fs.existsSync(FILE)
      ? JSON.parse(fs.readFileSync(FILE, "utf-8"))
      : [];

    existing.push({
      ts: Date.now(),
      state
    });

    fs.writeFileSync(FILE, JSON.stringify(existing, null, 2));
  } catch (e) {
    console.warn("SNAPSHOT FAIL:", e.message);
  }
}

export const snapshotEngine = {
  init() {
    setInterval(() => {
      saveSnapshot(globalState.getState());
    }, 5000);
  }
};
