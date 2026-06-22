#!/bin/bash

echo "🧠 ZERO BREAK MODE ACTIVE"

while true; do
  node server.js
  EXIT_CODE=$?

  echo "💥 Crash detected (code $EXIT_CODE) → restarting in 2s..."
  sleep 2
done
