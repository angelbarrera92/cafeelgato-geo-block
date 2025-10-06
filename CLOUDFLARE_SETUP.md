# 🌐 Custom Domain Configuration

This guide helps you configure the custom domain `ouch.cafeelgato.com` for your geo-blocking page automatically deployed with GitHub Actions.

## 📋 Prerequisites

- Project already deployed automatically with GitHub Actions
- Access to Cloudflare dashboard
- Domain `cafeelgato.com` configured in Cloudflare

## 🔧 Configure Custom Domain

### Step 1: Access the project in Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Go to **Workers & Pages**
4. Find and select the `cafeelgato-geo-block` project

### Step 2: Add the custom domain

1. Go to the **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `ouch.cafeelgato.com`
4. Click **Add custom domain**

### Step 3: Automatic configuration

Cloudflare automatically:
- ✅ Creates the CNAME record in your DNS
- ✅ Generates an SSL/TLS certificate
- ✅ Configures routing

### Step 4: Verification

1. **Wait 1-2 minutes** for the SSL certificate to activate
2. **Verify** that the page is available at: `https://ouch.cafeelgato.com`
3. **Check** that it displays the geo-blocking content correctly

## ✅ Final result

Once configured:
- 🌍 **Visitors from Spain**: Access `cafeelgato.com` normally
- 🚫 **Visitors from other countries**: Are redirected to `ouch.cafeelgato.com`

## 🔄 Update the URL in the Worker

After configuring the custom domain, update the `worker.js` file:

```javascript
const GEO_BLOCK_URL = 'https://ouch.cafeelgato.com'; // Custom domain
```

Commit and push the change so GitHub Actions automatically updates the Worker.

## 🆘 Troubleshooting

### Domain doesn't activate
- Verify that `cafeelgato.com` is managed in Cloudflare
- Wait up to 5 minutes for DNS propagation
- Purge cache if necessary

### SSL certificate error
- Wait a few more minutes for certificate generation
- Verify there are no conflicts with other services on the subdomain

### Content doesn't display
- Verify that the `cafeelgato-geo-block` project is deployed correctly
- Check that `index.html`, `styles.css` and `Logo.webp` files are in the `public/` folder

## 💡 Custom domain advantages

✅ **Cleaner URL**: `ouch.cafeelgato.com` vs `cafeelgato-geo-block.pages.dev`  
✅ **Brand consistency**: Maintains main domain  
✅ **Automatic SSL**: Certificate managed by Cloudflare  
✅ **Performance**: Optimized for your geographic zone  

---

## 📚 Related documentation

- [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) - Automated deployment configuration
- [README.md](README.md) - General project information

---

**Need help?** Check the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/platform/custom-domains/) 🚀
