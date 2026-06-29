#!/bin/bash

find core/kernel \
  -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*"
