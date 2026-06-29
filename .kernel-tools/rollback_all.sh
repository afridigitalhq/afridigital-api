#!/bin/bash

find core/kernel -name "*.kbak" | while read f; do
  mv "$f" "${f%.kbak}"
done

echo "ROLLBACK COMPLETE"
