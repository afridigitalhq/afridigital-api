#!/data/data/com.termux/files/usr/bin/bash

echo "🧠 STARTING AFRI DISTRIBUTED BRAIN..."

node workers/runtime/event.worker.js &
EVENT_PID=$!

node workers/runtime/ai.worker.js &
AI_PID=$!

echo "🧩 EVENT WORKER PID: $EVENT_PID"
echo "🧩 AI WORKER PID: $AI_PID"

wait
