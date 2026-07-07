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

## Access-gate config (index.html)

Three constants near the top of the `<script>` block wire up EmailJS, and one object controls which projects show live links vs. an email-capture form:

```js
const EJS_SERVICE  = 'YOUR_SERVICE_ID';   // EmailJS → Email Services
const EJS_TEMPLATE = 'YOUR_TEMPLATE_ID';  // EmailJS → Email Templates
const EJS_KEY      = 'YOUR_PUBLIC_KEY';   // EmailJS → Account → Public Key

const SHOW_LIVE = {
  dashboard:  true,   // Orders Dashboard — GCP
  nextjs:     true,   // Next.js Dashboard — AWS
  fargate:    true,   // Job Runner — AWS
  serverless: true,   // Event Pipeline — AWS
};
```

Set any key to `false` to replace that project's live buttons with a "Request access" form. Submissions call `emailjs.send()` directly from the browser — no backend needed — and land in your Gmail.

### Setting up EmailJS

1. Sign up at [emailjs.com](https://emailjs.com) (free tier: 200 emails/month)
2. **Email Services** → Add Service → connect Gmail (`gangulybikramjit@gmail.com`) → copy the Service ID
3. **Email Templates** → Create Template → use variables `{{from_email}}`, `{{project}}`, `{{requested}}` → copy the Template ID
4. **Account** → API Keys → copy the Public Key
5. Replace the three `YOUR_*` placeholders in `index.html`
