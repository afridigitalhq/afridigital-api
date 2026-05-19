const acorn = require("acorn");
const fs = require("fs");

function validateJS(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    acorn.parse(code, {
      ecmaVersion: 2022
    });

    return code.includes("module.exports");
  } catch (e) {
    return false;
  }
}

module.exports = { validateJS };
