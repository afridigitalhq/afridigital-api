module.exports = {
  apps: [{
    name: "afrios-backend",
    script: "./server.js",
    cwd: "./",
    watch: false,
    autorestart: true,
    max_memory_restart: "300M",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
