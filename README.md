# ☕ Café El Gato - Geo-blocking

Complete geo-restriction system for [cafeelgato.com](https://cafeelgato.com/) that automatically detects visitor location and redirects to an informative page when accessed from outside Spain.

## 🎯 What it does

- 🌍 **Visitors from Spain**: Access the main website normally
- 🚫 **Visitors from other countries**: Redirected to `ouch.cafeelgato.com` with a friendly message
- ⚡ **Automatic deployment**: GitHub Actions handles everything
- 🎨 **Brand consistency**: Matches Café El Gato's visual identity

## 🚀 Quick start

1. **Configure GitHub secrets**: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
2. **Push to GitHub**: Code deploys automatically
3. **Configure custom domain**: Add `ouch.cafeelgato.com` in Cloudflare Dashboard

📖 **Detailed setup**: [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)  
🌐 **Custom domain**: [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

## 🌍 How it works

```
Visitor → Cloudflare → Worker detects country
                              ↓
                    Is Spain (ES)?
                    ↓              ↓
                   Yes             No
                    ↓              ↓
           Main website    Geo-blocking page
         (cafeelgato.com)   (ouch.cafeelgato.com)
```

## 🔧 Worker configuration

The Worker in [`worker.js`](worker.js) provides flexible geo-blocking with multiple bypass options:

```javascript
// Configuration
const ALLOWED_COUNTRIES = ['ES']; // Countries with access
const BYPASS_PATHS = ['/api', '/webhook', '/health']; // Paths that bypass geo-blocking

// Bypass methods (in order of priority):
// 1. Header: X-Allow-Bypass: true
// 2. Path-based: Specific paths
// 3. Country-based: Allowed countries
```

**Key features:**
- ✅ **Header-based bypass**: Use `X-Allow-Bypass: true` header for full access
- ✅ **Path-based filtering**: Specific paths can bypass geo-blocking
- ✅ **Country detection**: Uses Cloudflare's `request.cf.country`
- ✅ **Clean redirects**: Simple redirect to geo-blocking page
- ✅ **Loop prevention**: Avoids infinite redirects

## 🎨 Design features

- ✅ Characteristic beige/brown color palette (#E8DCC8, #3D2817)
- ✅ Typography: Poppins and Libre Baskerville  
- ✅ Official Café El Gato logo
- ✅ Fully responsive design
- ✅ Contact information for international orders

## 🔄 Customization examples

### Allow multiple countries
```javascript
const ALLOWED_COUNTRIES = ['ES', 'PT', 'FR']; // Spain, Portugal, France
```

### Bypass geo-blocking for specific paths
```javascript
const BYPASS_PATHS = [
  '/api',        // API endpoints
  '/webhook',    // Webhooks  
  '/health',     // Health checks
  '/admin',      // Admin panel
  '/status'      // Status pages
];
```

### Header-based bypass for special access
```bash
# Complete bypass using header
curl -H "X-Allow-Bypass: true" https://cafeelgato.com/

# Regular request (follows geo-blocking rules)
curl https://cafeelgato.com/
```

### How it works
- **Header bypass**: `X-Allow-Bypass: true` allows full access from any country
- **Path bypass**: Specific paths accessible from any country
- **All other paths `/*`**: Geo-blocked by default
- **Clean redirect**: Simple redirect to geo-blocking page without parameters

## 📊 Monitoring

View statistics in **Cloudflare Dashboard** > **Workers & Pages** > **Metrics**:
- Requests by country
- Redirect rate  
- Errors

## 📝 License

© 2025 Café el Gato - All rights reserved

---

**Made with ☕ for Café El Gato**
