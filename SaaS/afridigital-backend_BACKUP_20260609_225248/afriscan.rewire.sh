#!/bin/bash

echo "🧠 AFRISCAN REALITY REWIRE ACTIVE"

# 1. FORCE CLEAN ENV SCORING
export AFRI_ENV_MODE="production"
export AFRI_SCAN_MODE="strict"

# 2. REMOVE DIRTY SIGNAL SOURCES
rm -f afriscan.strict.patch.js
rm -f afriscan.ignore
rm -f afriscan.scope.lock

# 3. FORCE REAL CORE ENTRY
AFRISCAN_ENTRY="./core/runtime/afriscan.runtime.js"

# 4. OVERRIDE NODE EXECUTION PATH (CLEAN TRUTH MODE)
node $AFRISCAN_ENTRY

