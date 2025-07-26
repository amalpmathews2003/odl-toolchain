#!/bin/bash

set -e

REPO="amalpmathews2003/odl-toolchain"
ASSET_NAME=".vsix"

echo "🔍 Fetching latest release info..."
LATEST_URL=$(curl -sL "https://api.github.com/repos/$REPO/releases/latest" \
  | grep "browser_download_url" \
  | grep "$ASSET_NAME" \
  | cut -d '"' -f 4)

if [ -z "$LATEST_URL" ]; then
  echo "❌ Failed to find .vsix asset in the latest release." >&2
  exit 1
fi

FILE_NAME=$(basename "$LATEST_URL")

echo "⬇️ Downloading $FILE_NAME..."
curl -L "$LATEST_URL" -o "$FILE_NAME"

echo "📦 Installing extension..."
code --install-extension "$FILE_NAME"

echo "✅ Extension installed successfully!"