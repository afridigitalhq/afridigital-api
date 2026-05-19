#!/data/data/com.termux/files/usr/bin/bash

APP="/storage/emulated/0/AfriDevOpsDB"
SNAP="/storage/emulated/0/AfriDevOpsDB-Backup/.snapshots"
BUS="$APP/ui/engine/event-bus.json"

write_event() {
  local msg="$1"
  local ts=$(date +"%H:%M:%S")

  # append event safely
  tmp=$(mktemp)
  jq ". + [{time:\"$ts\", event:\"$msg\"}]" $BUS > $tmp && mv $tmp $BUS
}

echo "AUTO-HEAL STARTED" 

while true; do

  if [ ! -f "$APP/ui/engine/bootstrap.js" ]; then

    write_event "🚨 UI FAILURE DETECTED"

    LATEST=$(ls -dt $SNAP/* 2>/dev/null | head -1)

    if [ -n "$LATEST" ]; then
      write_event "♻️ RESTORING SNAPSHOT"

      rm -rf $APP/*
      cp -r $LATEST/. $APP/

      write_event "✅ RESTORE COMPLETE"
    else
      write_event "❌ NO SNAPSHOT FOUND"
    fi
  fi

  sleep 5
done
