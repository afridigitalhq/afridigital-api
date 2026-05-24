const fs = require("fs");
const path = require("path");

const LOCK_FILE = path.join(__dirname, "../../africore.lock");

function acquireLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const oldPid = fs.readFileSync(LOCK_FILE, "utf8");

      try {
        process.kill(parseInt(oldPid), 0);
        console.log("🚫 AfriCore already running (PID:", oldPid, ")");
        console.log("⚠️ non-fatal subsystem failure");
      } catch {
        console.log("🧹 Stale lock found. Overriding...");
      }
    }

    fs.writeFileSync(LOCK_FILE, process.pid.toString());
    console.log("🔐 AfriCore lock acquired:", process.pid);

    process.on("exit", () => {
      try {
        fs.unlinkSync(LOCK_FILE);
      } catch {}
    });
  } catch (e) {
    console.log("LOCK ERROR:", e.message);
  }
}

module.exports = { acquireLock };
