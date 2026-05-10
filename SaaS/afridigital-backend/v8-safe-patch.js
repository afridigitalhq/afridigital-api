const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

// remove duplicate boot imports
c = c
  .split('\n')
  .filter(line =>
    !line.includes('v8.kernel') &&
    !line.includes('message.worker')
  )
  .join('\n');

// remove old boot calls
c = c.replace(/boot\\(app\\);/g, '');
c = c.replace(/startWorker\\(\\);/g, '');
c = c.replace(/app\\.listen[\\s\\S]*?\\}\\);/g, '');

const block = `
const { boot } = require("./core/bootstrap/v8.kernel");
const { startWorker } = require("./core/workers/message.worker");

boot(app);
startWorker();

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 CLEAN V8 KERNEL RUNNING ON PORT", PORT);
});
`;

c += block;

fs.writeFileSync('server.js', c);

console.log("🧠 V8 SAFE PATCH APPLIED CLEANLY");
