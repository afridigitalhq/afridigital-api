#!/data/data/com.termux/files/usr/bin/bash

node services/process/process.manager.cjs &

node kernel/runtime/v30.kernel.cjs &

node services/api-gateway/server.cjs
