#!/bin/bash

FILE="server.js"

echo "🧠 RESTORING API GATEWAY (HARD FIX)"

# ensure imports exist
grep -q "apiGateway" $FILE || sed -i '1a const apiGateway = require("./core/gateway/apiGateway");' $FILE

# ensure mount exists BEFORE listen
if ! grep -q "app.use('/api', apiGateway)" $FILE; then
  awk '
  /// app.listen DISABLED/ {
    print "app.use('/api', apiGateway);"
  }
  {print}
  ' $FILE > tmp.js && mv tmp.js $FILE
fi

echo "🚀 API GATEWAY RESTORED"
