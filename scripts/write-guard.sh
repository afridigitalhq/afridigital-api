safe_write() {
  if [ -e "$1" ] && [ -s "$1" ]; then
    echo "🔒 LOCKED (EXISTS): $1"
    return 1
  fi
}
