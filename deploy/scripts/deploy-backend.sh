#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <ec2-user@host> <ssh-key-path>"
  exit 1
fi

TARGET_HOST="$1"
SSH_KEY_PATH="$2"
TARGET_DIR="/home/ubuntu/apps/hangang-zip/backend"
JAR_PATH="$(find backend-skeleton/build/libs -maxdepth 1 -name '*.jar' | head -n 1)"

if [[ -z "$JAR_PATH" ]]; then
  echo "Backend jar not found. Run ./gradlew bootJar first."
  exit 1
fi

ssh -i "$SSH_KEY_PATH" "$TARGET_HOST" "mkdir -p $TARGET_DIR"
scp -i "$SSH_KEY_PATH" "$JAR_PATH" "$TARGET_HOST:$TARGET_DIR/hangang-zip-backend.jar"
ssh -i "$SSH_KEY_PATH" "$TARGET_HOST" "sudo systemctl restart hangang-backend && sudo systemctl status hangang-backend --no-pager"

echo "Backend deployed to $TARGET_HOST"
