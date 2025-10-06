# 🤖 Automated Deployment with GitHub Actions

Complete setup guide for fully automated deployment to Cloudflare using GitHub Actions.

##  Initial setup

### Step 1: Get Cloudflare credentials

#### API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token** > **Edit Cloudflare Workers** template
3. Copy the generated token (shown only once)

#### Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Copy the **Account ID** from the right sidebar

### Step 2: Configure GitHub secrets

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: [Your API token]
   - `CLOUDFLARE_ACCOUNT_ID`: [Your Account ID]

### Step 3: Create Cloudflare Pages project

1. Go to **Workers & Pages** > **Create application** > **Pages** > **Upload assets**
2. Upload any temporary file
3. Set **Project name**: `cafeelgato-geo-block`
4. Click **Save and Deploy**

### Step 4: First deployment

Push your code to trigger the first automated deployment:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will:
- Deploy static files from `public/` to Cloudflare Pages
- Deploy the Worker from `worker.js`
- Configure routes for `cafeelgato.com/*` and `www.cafeelgato.com/*`

---

## 🔍 What happens on each push

Every `git push` to `main` automatically:

1. **Deploys static page** to Cloudflare Pages
   - Uploads: `index.html`, `styles.css`, `Logo.webp`
   - Uses `wrangler-action@v3` (official Cloudflare action)

2. **Deploys Worker** to Cloudflare Workers  
   - Updates `worker.js` code
   - Maintains configured routes

3. **Verifies deployment** success

---

## 🚀 Daily workflow

```bash
# Make changes
git add .
git commit -m "Update design"
git push origin main
# ✅ Automatically deployed!
```

### Monitor deployments
- **GitHub**: Repository > **Actions** tab
- **Cloudflare**: Dashboard > **Workers & Pages** > **Metrics**

### Manual deployment
**Actions** tab > **Deploy to Cloudflare** > **Run workflow**

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| "API token invalid" | Regenerate token with correct permissions |
| "Account ID invalid" | Copy Account ID (not Zone ID) |
| "Project not found" | Create project manually first |
| Worker doesn't deploy | Check `wrangler.toml` configuration |
| Changes not reflected | Wait 1-2 minutes, purge Cloudflare cache |

---

## 💡 Advantages

✅ **Zero manual work** - Just `git push`  
✅ **Consistent deployments** - Same process every time  
✅ **Complete history** - Track all changes  
✅ **Fast** - Deploy in under 2 minutes  
✅ **Reversible** - Easy rollback with `git revert`

---

## 🔄 Rollback

```bash
# Revert to previous version
git revert <commit-hash>
git push origin main
# ✅ Previous version automatically deployed
```
