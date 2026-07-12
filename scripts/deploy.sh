#!/usr/bin/env bash
set -e
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CREDS="$REPO_DIR/.emailjs"

_encode() { python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"; }

_seed_url() {
  source "$CREDS"
  echo "http://localhost:9090?s=$(_encode "$EJS_S")&t=$(_encode "$EJS_T")&k=$(_encode "$EJS_K")&e=$(_encode "$EJS_E")"
}

_ensure_creds() {
  [[ -f "$CREDS" ]] && return
  printf '\n╔══════════════════════════════════════════════╗\n'
  printf '║           EmailJS One-Time Setup             ║\n'
  printf '╚══════════════════════════════════════════════╝\n'
  printf '\nThe contact form sends email via EmailJS.\n'
  printf 'Log in or create a free account at: https://www.emailjs.com\n'
  printf '\n── Where to find each value ──────────────────────────────────\n'
  printf '  Service ID   Left nav → Email Services → your service row\n'
  printf '  Template ID  Left nav → Email Templates → your template row\n'
  printf '  Public Key   Top-right avatar → Account → API Keys\n'
  printf '\n── Template variables (paste into your EmailJS template body) ─\n'
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
}

printf '\n  [1] Local  — serve on :9090, seed contact-form localStorage\n'
printf '  [2] Publish — probe live endpoints, update deploy-live.js, push to Pages\n\n'
read -rp 'Choose [1]: ' _MODE

# ── Local dev ─────────────────────────────────────────────────────────────────
if [[ "${_MODE:-1}" != "2" ]]; then
  _ensure_creds
  open "$(_seed_url)" &
  echo "Serving at http://localhost:9090"
  python3 -m http.server 9090 --directory "$REPO_DIR"
  exit 0
fi

# ── Publish ───────────────────────────────────────────────────────────────────
cd "$REPO_DIR"

_yn() {
  local prompt="$1" default="${2:-y}" ans
  read -rp "  $prompt (y/n) [$default]: " ans
  ans="${ans:-$default}"
  [[ "$ans" =~ ^[Yy] ]] && echo "true" || echo "false"
}

_probe() {
  local url="$1" code
  code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 --max-time 30 "$url" 2>/dev/null || echo "000")
  [[ "$code" =~ ^2 ]] && echo "y" || echo "n"
}

_label() { [[ "$1" == "y" ]] && echo "UP" || echo "DOWN"; }

_read_live_url() {
  local _key="$1" _f="$REPO_DIR/live-urls.js"
  [[ -f "$_f" ]] || { echo ""; return; }
  python3 - "$_key" "$_f" <<'PYEOF'
import re, sys
m = re.search(re.escape(sys.argv[1]) + r":\s*'([^']+)'", open(sys.argv[2]).read())
print(m.group(1) if m else '')
PYEOF
}

printf '\n━━━ Probing live endpoints (up to 30s each)…\n'
_DASH_FE_URL=$(_read_live_url dashboardLiteFe)
[[ -z "$_DASH_FE_URL" ]] && _DASH_FE_URL=$(_read_live_url dashboardFullFe)
_P_DASH_FE=$( [[ -n "$_DASH_FE_URL" ]] && _probe "${_DASH_FE_URL%/}/" || echo "n" )
_NEXT_FE_URL=$(_read_live_url nextjsFe)
_NEXT_BE_URL=$(_read_live_url nextjsBe)
_P_NEXT_FE=$( [[ -n "$_NEXT_FE_URL" ]] && _probe "${_NEXT_FE_URL%/}/" || echo "n" )
_P_NEXT_BE=$( [[ -n "$_NEXT_BE_URL" ]] && _probe "$_NEXT_BE_URL"    || echo "n" )
_P_SRVL_FE=$(_probe "https://d281doisqbuiu2.cloudfront.net/")
_P_SRVL_BE=$(_probe "https://d281doisqbuiu2.cloudfront.net/api-explorer.html")
printf 'Done.\n'

printf '\n━━━ Live endpoint selection (Enter = accept probe, y/n = override) ━━━\n\n'
printf 'GCP dashboard\n'
DASH_FE=$(_yn "  frontend       probe: $(_label "$_P_DASH_FE")" "$_P_DASH_FE")
DASH_BE=$(_yn "  API explorer   static file, always available" y)
printf '\nNext.js dashboard (AWS)\n'
NEXT_FE=$(_yn "  frontend       probe: $(_label "$_P_NEXT_FE")" "$_P_NEXT_FE")
NEXT_BE=$(_yn "  API explorer   probe: $(_label "$_P_NEXT_BE")" "$_P_NEXT_BE")
printf '\nEvent Pipeline (serverless)\n'
SRVL_FE=$(_yn "  frontend       probe: $(_label "$_P_SRVL_FE")" "$_P_SRVL_FE")
SRVL_BE=$(_yn "  API explorer   probe: $(_label "$_P_SRVL_BE")" "$_P_SRVL_BE")
printf '\n'

FARG_FE=false; FARG_BE=false

printf '\nAI / LLM section\n'
LLM_SECTION=$(_yn "  show on live site? (hidden by default)" n)

if [[ "$LLM_SECTION" == "true" ]]; then
  printf '\nRebuilding nl-to-sql app...\n'
  npm --prefix /Users/bikram/Personal/interview-prep/grouped-projects/llm-implementations/natural-language-to-llm-query-comparison run build -- --base=/nl-to-sql/ 2>&1 | tail -5
  rm -rf "$REPO_DIR/nl-to-sql"
  cp -r /Users/bikram/Personal/interview-prep/grouped-projects/llm-implementations/natural-language-to-llm-query-comparison/dist "$REPO_DIR/nl-to-sql"
fi

cat > "$REPO_DIR/deploy-live.js" <<EOF
// Generated by deploy.sh — do not edit manually.
window._deployLive = {
  showLlmSection: $LLM_SECTION,
  dashboard:  { frontend: $DASH_FE,  backend: $DASH_BE  },
  nextjs:     { frontend: $NEXT_FE,  backend: $NEXT_BE  },
  fargate:    { frontend: $FARG_FE,  backend: $FARG_BE  },
  serverless: { frontend: $SRVL_FE,  backend: $SRVL_BE  },
};
EOF

git add index.html deploy-live.js scripts/deploy.sh nl-to-sql/
if ! git diff --cached --quiet; then
  git commit -m "deploy: update live endpoint selection"
fi
git push origin HEAD:main
echo "Published. Pages rebuilds in ~30s."
