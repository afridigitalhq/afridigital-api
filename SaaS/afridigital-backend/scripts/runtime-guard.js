const fs = require("fs");

const scan = (dir) => {
  const execSync = require("child_process").execSync;
  try {
    const out = execSync(`grep -R "// app.listen DISABLED\\|http.listen" ${dir} --exclude-dir=node_modules`, { encoding: "utf8" });
    if (out.includes("listen")) {
      console.log("🚨 RUNTIME GUARD: forbidden listener detected");
      process.exit(1);
    }
  } catch {}
};

scan(".");
