#!/usr/bin/env bash
set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

case "${1:-}" in
  dev)
    echo "Serving at http://localhost:8080"
    open http://localhost:8080 &
    python3 -m http.server 8080 --directory "$REPO_DIR"
    ;;
  ""|deploy)
    cd "$REPO_DIR"
    git push
    gh workflow run "Deploy Pages" --repo bganguly/bganguly.github.io --ref main
    echo "Triggered. Check: gh run list --repo bganguly/bganguly.github.io"
    ;;
  *)
    echo "Usage: $0 [dev|deploy]"
    exit 1
    ;;
esac
