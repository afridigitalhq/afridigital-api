#!/usr/bin/env bash

export AFRISCAN_TIME="$(date '+%Y-%m-%d %H:%M:%S %Z')"

node -e "
const t = process.env.AFRISCAN_TIME;
console.log('🕒 AFRISCAN TIME:', t);
"
