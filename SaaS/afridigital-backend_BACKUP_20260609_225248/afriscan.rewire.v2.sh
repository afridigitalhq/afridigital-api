#!/bin/bash

ROOT="$(pwd)"

echo "🧠 AFRISCAN v2 CLEAN MODE"

# STRICT SCAN SCOPE ONLY
SCOPE="src core app controllers services"

# EXCLUDE DIRS
EXCLUDES="node_modules afribk archive _SAFE_ core/runtime/backups obs-dashboard"

#################################
# ACTIVE NODES (REAL ONLY)
#################################
ACTIVE_NODES=$(pgrep node | wc -l)

echo ""
echo "📦 RUNTIME"
echo "active_nodes=$ACTIVE_NODES"

#################################
# STRICT DUPLICATE ENGINE (100% HASH ONLY)
#################################
hash_file() {
  sha256sum "$1" 2>/dev/null | awk '{print $1}'
}

DUP_COUNT=0
TOTAL_FILES=0

declare -A seen

for dir in $SCOPE; do
  [ -d "$dir" ] || continue

  while IFS= read -r file; do
    TOTAL_FILES=$((TOTAL_FILES+1))
    h=$(hash_file "$file")

    if [ -n "$h" ]; then
      if [ "${seen[$h]}" == "1" ]; then
        DUP_COUNT=$((DUP_COUNT+1))
      else
        seen[$h]=1
      fi
    fi
  done < <(find "$dir" -type f -name "*.js" 2>/dev/null)

done

#################################
# LISTENER COUNT (CLEAN ONLY)
#################################
LISTENERS=$(grep -R "app.listen\|server.listen" src core app 2>/dev/null \
  | grep -v "backup" \
  | wc -l)

#################################
# ENV SCORE (UNCHANGED LOGIC)
#################################
score=0
[ -n "$META_TOKEN" ] && score=$((score+20))
[ -n "$META_PHONE_ID" ] && score=$((score+10))
[ -n "$JWT_SECRET" ] && score=$((score+25))
[ -n "$DATABASE_URL" ] && score=$((score+25))
[ -n "$REDIS_URL" ] && score=$((score+20))

#################################
# RISK (REDUCED NOISE IMPACT)
#################################
RISK=0

[ -z "$DATABASE_URL" ] && RISK=$((RISK+25))
[ -z "$REDIS_URL" ] && RISK=$((RISK+15))
[ -z "$META_TOKEN" ] && RISK=$((RISK+10))

# IMPORTANT: ignore listener explosion from backups
if [ "$LISTENERS" -gt 100 ]; then
  RISK=$((RISK+5))
fi

#################################
# FINAL SCORE
#################################
FINAL=$((score - RISK + 60))

[ $FINAL -lt 0 ] && FINAL=0
[ $FINAL -gt 100 ] && FINAL=100

echo ""
echo "🧬 DEPENDENCIES"
echo "total_files=$TOTAL_FILES"
echo "duplicates_100pct=$DUP_COUNT"

echo ""
echo "🏗 CLEAN ARCHITECTURE"
echo "listeners_clean=$LISTENERS"

echo ""
echo "🚀 RENDER SCORE ENGINE"
echo "risk=$RISK/100"
echo "env_score=$score/100"
echo "final_health=$FINAL/100"

if [ $FINAL -ge 80 ]; then
  echo "STATUS=READY"
elif [ $FINAL -ge 50 ]; then
  echo "STATUS=DEGRADED"
else
  echo "STATUS=NOT_READY"
fi

