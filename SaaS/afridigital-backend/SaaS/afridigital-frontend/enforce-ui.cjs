const fs = require("fs");
const path = require("path");
const { runKernel } = require("../afridigital-backend/modules/ai-engine/truthKernel");

const filePath = path.join(__dirname, "dist/index.html");

let html = fs.readFileSync(filePath, "utf-8");

const fixedHtml = runKernel(html);

if (fixedHtml && fixedHtml !== html) {
  fs.writeFileSync(filePath, fixedHtml);
  console.log("💾 HTML auto-corrected and saved");
}
