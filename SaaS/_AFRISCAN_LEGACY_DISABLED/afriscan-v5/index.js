const fs = require("fs");
const os = require("os");
const http = require("http");
const https = require("https");
const { URL } = require("url");

/* =========================
   CONFIG (ARCHITECTURE TRUTH)
========================= */
const CONFIG = {
  api: "https://afridigital-api.onrender.com",
  frontend: "https://afridigital-hub.onrender.com",
  local: "http://localhost:10000",
  drift_threshold: 15
};
