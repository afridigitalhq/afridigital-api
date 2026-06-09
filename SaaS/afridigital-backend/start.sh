#!/bin/bash

bash core/kernel/freeze-v2-1.sh || exit 1

node src/index.js
