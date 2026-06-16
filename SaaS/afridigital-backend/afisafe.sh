#!/bin/bash

# 🧠 FORCE ROOT SAFETY LAYER
BASE="$HOME/AfriDigitalHub/SaaS/afridigital-backend"

cd "$BASE" || {
  echo "❌ FAILED: cannot enter project root"
  exit 1
}

echo "🧠 AFRISAFE: ROOT LOCKED"
echo "📍 $(pwd)"

# prevent accidental wrong execution
if [ ! -f "package.json" ]; then
  echo "❌ NOT A VALID NODE PROJECT ROOT"
  exit 1
fi

