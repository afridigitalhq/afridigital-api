const API_URL = process.env.API_URL;

setInterval(() => {
  console.log("🌐 HEARTBEAT -> Render sync ping:", API_URL);
}, 15000);
