#!/usr/bin/env bash
set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CREDS="$REPO_DIR/.emailjs"

_encode() { python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"; }

_seed_url() {
  source "$CREDS"
  echo "http://localhost:9090?s=$(_encode "$EJS_S")&t=$(_encode "$EJS_T")&k=$(_encode "$EJS_K")&e=$(_encode "$EJS_E")"
}

case "${1:-}" in
  dev)
    if [[ ! -f "$CREDS" ]]; then
      printf '\nNo .emailjs creds found — starting one-time setup to configure the contact form.\n'
      exec "$0" setup
    fi
    open "$(_seed_url)" &
    echo "Serving at http://localhost:9090"
    python3 -m http.server 9090 --directory "$REPO_DIR"
    ;;
  setup)
    printf '\n╔══════════════════════════════════════════════╗\n'
    printf '║           EmailJS One-Time Setup             ║\n'
    printf '╚══════════════════════════════════════════════╝\n'
    printf '\nThe contact form sends email via EmailJS.\n'
    printf 'Log in or create a free account at: https://www.emailjs.com\n'
    printf '\n── Where to find each value ──────────────────────────────────\n'
    printf '  Service ID   Left nav → Email Services → your service row\n'
    printf '  Template ID  Left nav → Email Templates → your template row\n'
    printf '  Public Key   Top-right avatar → Account → API Keys\n'
    printf '\n── Template variables (paste these into your EmailJS template body) ─\n'
    printf '  {{from_email}}  the email address the visitor types in the form\n'
    printf '  {{project}}     auto-filled: which project was clicked\n'
    printf '  {{requested}}   auto-filled: which artifact was requested\n'
    printf '\n── Contact email ─────────────────────────────────────────────\n'
    printf '  The address EmailJS will deliver to (your inbox).\n'
    printf '─────────────────────────────────────────────────────────────\n\n'
    read -rp 'Service ID    : ' EJS_S
    read -rp 'Template ID   : ' EJS_T
    read -rp 'Public Key    : ' EJS_K
    read -rp 'Contact email : ' EJS_E
    printf 'EJS_S=%s\nEJS_T=%s\nEJS_K=%s\nEJS_E=%s\n' "$EJS_S" "$EJS_T" "$EJS_K" "$EJS_E" > "$CREDS"
    echo "Saved to .emailjs"
    python3 -m http.server 9090 --directory "$REPO_DIR" &>/dev/null &
    SERVER_PID=$!
    sleep 0.4
    open "$(_seed_url)"
    printf '\nBrowser localStorage seeded. Press Enter to stop the server...'
    read -r
    kill "$SERVER_PID" 2>/dev/null || true
    ;;
  ""|deploy)
    cd "$REPO_DIR"
    git push
    gh workflow run "Deploy Pages" --repo bganguly/bganguly.github.io --ref main
    echo "Triggered. Check: gh run list --repo bganguly/bganguly.github.io"
    ;;
  *)
    echo "Usage: $0 [dev|setup|deploy]"
    exit 1
    ;;
esac
