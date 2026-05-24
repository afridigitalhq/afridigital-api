const API_URL = "https://afridigital-api.onrender.com";

function ping() {
  console.log("🌐 Syncing with Render:", API_URL);
}

setInterval(ping, 60000);

module.exports = ping;
