module.exports = {
  apps: [{
    name: "afrios-backend",
    script: "server.js",
    cwd: process.cwd(),
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    watch: false,
    autorestart: true,
    max_restarts: 10,
    exp_backoff_restart_delay: 1000
  }]
};
