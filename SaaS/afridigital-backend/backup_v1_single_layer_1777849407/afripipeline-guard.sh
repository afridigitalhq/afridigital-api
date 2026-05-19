#!/bin/bash

echo "🧪 BUILD VALIDATION START"

cd SaaS/afridigital-frontend || exit 1

# install check
if [ ! -f "package.json" ]; then
  echo "❌ Missing package.json"
  exit 1
fi

# dependency check
npm install || exit 1

# build check
npm run build || exit 1

# verify output
if [ ! -f "dist/index.html" ] && [ ! -f "index.html" ]; then
  echo "❌ Build failed (no output)"
  exit 1
fi

echo "✅ FRONTEND BUILD VALID"
