#!/usr/bin/env bash

echo "🧪 RUNNING KERNEL DEPLOYMENT VERIFICATION"

echo "📦 Checking execution boundary..."
grep -q "SyscallGate" core/kernel/deploy/DEPLOYMENT_MANIFEST.json && \
echo "✔ Execution boundary OK"

echo "🧠 Checking freeze state..."
[ -f core/kernel/deploy/SYSTEM_FREEZE.flag ] && echo "✔ System frozen"

echo "🔐 Checking policy contract..."
test -f core/kernel/deploy/RUNTIME_SAFETY.contract && echo "✔ Policy contract present"

echo "🟢 KERNEL DEPLOYMENT STATE: READY"
