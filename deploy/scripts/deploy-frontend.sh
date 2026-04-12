#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <ec2-user@host> <ssh-key-path> [domain]"
  exit 1
fi

TARGET_HOST="$1"
SSH_KEY_PATH="$2"
DOMAIN="${3:-https://hangang.jihosong.com}"
TARGET_DIR="/var/www/hangang-zip"

VITE_PARK_DATA_SOURCE=api VITE_API_BASE_URL="$DOMAIN" npm run build

ssh -i "$SSH_KEY_PATH" "$TARGET_HOST" "sudo mkdir -p $TARGET_DIR && sudo chown -R ubuntu:ubuntu $TARGET_DIR"
scp -i "$SSH_KEY_PATH" -r dist/* "$TARGET_HOST:$TARGET_DIR/"
ssh -i "$SSH_KEY_PATH" "$TARGET_HOST" "sudo find $TARGET_DIR -type d -exec chmod 755 {} \\; && sudo find $TARGET_DIR -type f -exec chmod 644 {} \\; && sudo systemctl reload nginx"

echo "Frontend deployed to $TARGET_HOST"
