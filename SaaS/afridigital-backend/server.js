const app = require('./src/index.js');

console.log("🧠 SERVER BOOTSTRAP LOADING src/index.js");

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 FULL API LIVE ON PORT", PORT);
});
