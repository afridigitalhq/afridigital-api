#!/bin/bash

echo "🌐 MONOREPO DEPLOY START"

cd AfriDigital-api && bash DevOps/cicd.sh || exit 1

cd ../AfriDigital-hub && \
npm install && npm run build && \
git add . && \
git commit -m "frontend deploy $(date)" || true && \
git push origin main

echo "🔥 FULL SYSTEM DEPLOYED"
