# bganguly.github.io — Portfolio

Static single-page portfolio + API explorer. Deployed to GitHub Pages via a GitHub Actions workflow.

---

## Local dev

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static file server works — the site has no build step.

---

## Deploy

```bash
gh workflow run "Deploy Pages" --repo bganguly/bganguly.github.io --ref main
```

GitHub Pages can be flaky. If it fails with "Deployment failed, try again later", re-run the same command.

---

## Structure

```
index.html                        # Main portfolio page (single file)
orders-dashboard/
  api-explorer.html               # Live API explorer for the GCP Orders Dashboard
README.md
```

---

## Access-gate config

`SHOW_LIVE` in `index.html` controls whether each project shows its live link or an email-capture form. All keys default to `false` in source — nothing is ever committed to change this.

```js
const SHOW_LIVE = {
  dashboard:  false,  // Orders Dashboard — GCP
  nextjs:     false,  // Next.js Dashboard — AWS
  fargate:    false,  // Job Runner — AWS
  serverless: false,  // Event Pipeline — AWS
};
```

### EmailJS setup (one-time, per browser)

EmailJS IDs are stored in `localStorage` only — never in source control.

1. Go to [emailjs.com](https://emailjs.com) → **Sign in with Google** (no new account needed)
2. **Email Services** → Add Service → connect Gmail or Outlook → note the Service ID
3. **Email Templates** → Create Template with variables `{{from_email}}`, `{{project}}`, `{{requested}}` → note the Template ID
4. **Account** → API Keys → copy the Public Key
5. Visit the live site (or localhost) with `?setup` appended to the URL:
   ```
   https://bganguly.github.io?setup
   http://localhost:8080?setup
   ```
   Fill the three prompts. IDs are saved to `localStorage` and the param is stripped from the URL.

To re-configure, visit `?setup` again. To show a project's live link directly, flip its `SHOW_LIVE` key to `true`.
