#!/bin/bash
sed -i '1a const router = require("../runtime/brain.v12.router");' africore/gateway/webhook.gateway.js
