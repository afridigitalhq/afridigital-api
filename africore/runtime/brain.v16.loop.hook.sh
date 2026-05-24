#!/bin/bash

sed -i '1a const forecast = require("../runtime/brain.v16.revenue.forecast");' africore/gateway/webhook.gateway.js
sed -i '1a const churn = require("../runtime/brain.v16.churn.predictor");' africore/gateway/webhook.gateway.js
sed -i '1a const pricing = require("../runtime/brain.v16.pricing.engine");' africore/gateway/webhook.gateway.js

