const http = require('./core/http/app');

const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Render service running on", PORT);
});
