const app = require('./src/index.js');

console.log("🧠 CLEAN BOOTSTRAP ACTIVE");

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 EXPRESS RAW MODE ACTIVE ON", PORT);
});
