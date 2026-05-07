#!/data/data/com.termux/files/usr/bin/bash

node kernel/runtime/v30.kernel.cjs &

node services/api-gateway/server.cjs
