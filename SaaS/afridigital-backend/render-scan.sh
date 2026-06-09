grep -R "// app.listen DISABLED\|http.listen" -n . \
  --exclude-dir=node_modules \
  --exclude-dir=archive \
  --exclude-dir=afribk
