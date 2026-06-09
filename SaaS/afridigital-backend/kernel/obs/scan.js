const { execSync } = require("child_process");
const obs = require("./runtime-observer");

function scan() {
  try {
    const out = execSync(
      "grep -R \"// app.listen DISABLED\\|http.listen\" . --exclude-dir=node_modules --exclude-dir=archive --exclude-dir=afribk",
      { encoding: "utf8" }
    );

    const lines = out.split("\n").filter(Boolean);
    lines.forEach(l => obs.trackListener(l));
  } catch {}
}

module.exports = scan;
