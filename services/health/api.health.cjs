const axios = require("axios");

async function check() {
  try {
    const res = await axios.get(
      process.env.API_URL
    );

    console.log("🌐 API HEALTH:", res.status);
  } catch (err) {
    console.log("❌ API HEALTH FAIL");
  }
}

setInterval(check, 30000);

check();
