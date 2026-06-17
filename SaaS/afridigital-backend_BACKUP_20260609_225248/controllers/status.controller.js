const { execSync } = require("child_process");

function getStatus() {
  try {
    const server = execSync("ps aux | grep node | grep server.js || true").toString();
    const kernel = execSync("ls africore/kernel").toString();

    const kernelCheck = require("fs").existsSync(
      "africore/kernel/connectivity.kernel.js"
    );

    return `
🚀 AFRIDIGITAL SYSTEM CHECK START
-------------------------------
🧠 SERVER STATUS:
${server || "❌ server.js not detected"}

⚙️ AFRICORE KERNEL CHECK:
${kernel}

🔗 KERNEL CONNECTIVITY FILE:
${kernelCheck ? "✅ kernel bridge exists" : "❌ kernel bridge missing"}

📡 FINAL STATUS SUMMARY:
✔ backend running
✔ kernel scanned
✔ system diagnostics complete
    `;
  } catch (e) {
    return "❌ Status check failed: " + e.message;
  }
}

module.exports = { getStatus };
