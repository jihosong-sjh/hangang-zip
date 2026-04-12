#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <ec2-user@host> <ssh-key-path>"
  exit 1
fi

TARGET_HOST="$1"
SSH_KEY_PATH="$2"

scp -i "$SSH_KEY_PATH" deploy/nginx/hangang-zip.conf "$TARGET_HOST:/tmp/hangang-zip.conf"
scp -i "$SSH_KEY_PATH" deploy/systemd/hangang-backend.service "$TARGET_HOST:/tmp/hangang-backend.service"
scp -i "$SSH_KEY_PATH" deploy/env/backend.env.example "$TARGET_HOST:/tmp/backend.env.example"

ssh -i "$SSH_KEY_PATH" "$TARGET_HOST" <<'EOF'
set -euo pipefail
mkdir -p /home/ubuntu/apps/hangang-zip/backend
mkdir -p /home/ubuntu/apps/hangang-zip/frontend
sudo mv /tmp/hangang-zip.conf /etc/nginx/sites-available/hangang-zip
sudo ln -sf /etc/nginx/sites-available/hangang-zip /etc/nginx/sites-enabled/hangang-zip
sudo mv /tmp/hangang-backend.service /etc/systemd/system/hangang-backend.service
mv /tmp/backend.env.example /home/ubuntu/apps/hangang-zip/backend/.env
chmod 600 /home/ubuntu/apps/hangang-zip/backend/.env
sudo systemctl daemon-reload
sudo nginx -t
EOF

echo "Server config templates installed on $TARGET_HOST"
