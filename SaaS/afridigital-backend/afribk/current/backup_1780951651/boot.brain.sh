#!/data/data/com.termux/files/usr/bin/bash

cd "$(dirname "$0")"

echo "🚀 BOOTING AFRI KERNEL v2..."

node afri.js &
node start.brain.sh &

wait
