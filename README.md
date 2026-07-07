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

Two constants near the top of the `<script>` block control whether live links are shown or replaced with an email-capture form:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const SHOW_LIVE = {
  dashboard:  true,   // Orders Dashboard — GCP
  nextjs:     true,   // Next.js Dashboard — AWS
  fargate:    true,   // Job Runner — AWS
  serverless: true,   // Event Pipeline — AWS
};
```

Set any key to `false` to replace that project's live buttons with a "Request access" email form. Submissions POST to Formspree, which emails you at gangulybikramjit@gmail.com.

### Setting up Formspree

1. Go to [formspree.io](https://formspree.io) and sign in with GitHub
2. Create a new form → set the notification email to `gangulybikramjit@gmail.com`
3. Copy the form ID from the endpoint URL (e.g. `https://formspree.io/f/xyzabcde` → ID is `xyzabcde`)
4. Replace `YOUR_FORM_ID` in `index.html`
