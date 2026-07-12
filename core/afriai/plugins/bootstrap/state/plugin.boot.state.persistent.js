const fs = require("fs");
const path = require("path");

const STATE_PATH = path.resolve("snapshots/system/state/boot.state.json");

function readState() {
  if (!fs.existsSync(STATE_PATH)) {
    return {
      booted: false,
      lastBoot: null,
      kernelFingerprint: null,
      loadedManifests: []
    };
  }
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

class PersistentBootState {

  get() {
    return readState();
  }

  isBooted() {
    return readState().booted === true;
  }

  markBooted(fingerprint, manifests = []) {
    const state = readState();

    state.booted = true;
    state.lastBoot = Date.now();
    state.kernelFingerprint = fingerprint;
    state.loadedManifests = manifests;

    writeState(state);

    return state;
  }

  reset() {
    const state = {
      booted: false,
      lastBoot: null,
      kernelFingerprint: null,
      loadedManifests: []
    };
    writeState(state);
    return state;
  }

}

module.exports = new PersistentBootState();
