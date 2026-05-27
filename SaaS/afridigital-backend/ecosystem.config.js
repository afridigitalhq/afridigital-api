module.exports = {
  apps: [{
    name: "afrios-backend",
    script: "server.js",
    cwd: "/data/data/com.termux/files/home/AfriDigitalHub/SaaS/afridigital-backend",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    watch: false,
    max_memory_restart: "300M",
    restart_delay: 3000
  }]
};
