# ☕ Café El Gato - S## 📁 Estructura del proyecto

```
cafeelgato-geo-block/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Action para despliegue automático
├── public/                         # Archivos estáticos para Cloudflare Pages
│   ├── index.html                  # Página de geo-bloqueo
│   ├── styles.css                  # Estilos CSS
│   └── Logo.webp                   # Logo de Café El Gato
├── worker.js                       # Cloudflare Worker
├── wrangler.toml                   # Configuración de Wrangler
├── .gitignore                      # Archivos ignorados por git
├── README.md                       # Este archivo
├── CLOUDFLARE_SETUP.md             # Guía manual de configuración
└── GITHUB_ACTIONS_SETUP.md         # Guía de despliegue automático
```queo

Sistema completo de geo-restricción para [cafeelgato.com](https://cafeelgato.com/) que detecta automáticamente la ubicación del visitante y redirige a una página informativa cuando se accede desde fuera de España.

## 📋 Descripción

Este proyecto incluye:
- **Página de geo-bloqueo**: Diseño elegante que mantiene la identidad visual de Café El Gato
- **Cloudflare Worker**: Detecta automáticamente el país del visitante
- **Despliegue automatizado**: GitHub Actions para CI/CD completo

## 🎨 Diseño

La página mantiene el look and feel de [cafeelgato.com](https://cafeelgato.com/), incluyendo:
- ✅ Paleta de colores beige/marrón característica (#E8DCC8, #3D2817)
- ✅ Tipografías: Poppins y Libre Baskerville
- ✅ Logo oficial de Café El Gato
- ✅ Estilo minimalista y elegante
- ✅ Diseño completamente responsive

## 📁 Estructura del proyecto

```
cafeelgato-geo-block/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Action para despliegue automático
├── index.html                      # Página de geo-bloqueo
├── styles.css                      # Estilos CSS
├── Logo.webp                       # Logo de Café El Gato
├── worker.js                       # Cloudflare Worker
├── wrangler.toml                   # Configuración de Wrangler
├── .gitignore                      # Archivos ignorados por git
├── README.md                       # Este archivo
├── CLOUDFLARE_SETUP.md            # Guía manual de configuración
└── GITHUB_ACTIONS_SETUP.md        # Guía de despliegue automático
```

## 🚀 Inicio rápido

### Opción 1: Despliegue automático (Recomendado)

1. **Configura los secretos en GitHub** (solo una vez):
   - `CLOUDFLARE_API_TOKEN`: Tu API token de Cloudflare
   - `CLOUDFLARE_ACCOUNT_ID`: Tu Account ID de Cloudflare

2. **Sube el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tu-repo-url>
   git push -u origin main
   ```

3. **¡Listo!** GitHub Actions desplegará automáticamente:
   - La página a Cloudflare Pages
   - El Worker a Cloudflare Workers

📖 **Guía completa**: Ver [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

### Opción 2: Despliegue manual

1. **Desplegar página en Cloudflare Pages**
2. **Crear Worker en Cloudflare**
3. **Asociar Worker a las rutas**:
   - `cafeelgato.com/*`
   - `www.cafeelgato.com/*`

📖 **Guía completa**: Ver [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

## 🌍 Funcionamiento

```
Visitante → Cloudflare → Worker detecta país
                              ↓
                    ¿Es España (ES)?
                    ↓              ↓
                   Sí              No
                    ↓              ↓
           Web principal    Página geo-bloqueo
         (cafeelgato.com)   (cafeelgato-geo-block.pages.dev)
```

### Compatibilidad con reglas existentes

El Worker se ejecuta **después** de tus reglas de seguridad actuales:

1. DDoS Protection
2. Firewall Rules (WAF, bots, IPs)
3. Rate Limiting
4. **Workers** ← Geo-bloqueo aquí
5. Caché
6. Origin Server

✅ No necesitas cambiar tus reglas existentes

## 📧 Contacto

La página incluye información de contacto para pedidos internacionales:
- **Emails**: angel@cafeelgato.com, natalia@cafeelgato.com
- **Instagram**: [@_cafeelgato](https://www.instagram.com/_cafeelgato/)

## 🔧 Configuración del Worker

El Worker en `worker.js` detecta el país usando `request.cf.country` y redirige automáticamente:

```javascript
export default {
  async fetch(request, env) {
    const country = request.cf?.country;
    const GEO_BLOCK_URL = 'https://cafeelgato-geo-block.pages.dev';
    
    if (country !== 'ES') {
      const url = new URL(request.url);
      if (!url.hostname.includes('cafeelgato-geo-block.pages.dev')) {
        return Response.redirect(GEO_BLOCK_URL, 302);
      }
    }
    
    return fetch(request);
  }
}
```

## 🎯 Características

### Página web
- ✅ Diseño coherente con la marca Café El Gato
- ✅ Mensaje claro sobre la disponibilidad geográfica
- ✅ Información de contacto accesible
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Animaciones sutiles
- ✅ Optimizado para carga rápida
- ✅ Logo oficial incluido

### Worker
- ✅ Detección automática de país
- ✅ Redirección transparente (302)
- ✅ Compatible con `cafeelgato.com` y `www.cafeelgato.com`
- ✅ Prevención de bucles de redirección
- ✅ No interfiere con reglas de seguridad existentes

### CI/CD
- ✅ Despliegue automático con GitHub Actions
- ✅ Deploy en cada push a `main`
- ✅ Actualización simultánea de página y worker

## 🧪 Probar el geo-bloqueo

### Método 1: Usando VPN
```
1. Conéctate a VPN de otro país (USA, UK, etc.)
2. Visita cafeelgato.com
3. Deberías ver la página de geo-bloqueo
```

### Método 2: Simular país en el Worker (desarrollo)
```javascript
// Temporal - solo para pruebas
const country = 'US'; // Simula USA
// const country = request.cf?.country; // Producción
```

### Método 3: Usando curl
```bash
# Simular España (acceso permitido)
curl -H "CF-IPCountry: ES" https://cafeelgato.com

# Simular USA (geo-bloqueado)
curl -H "CF-IPCountry: US" https://cafeelgato.com
```

## 📊 Monitoreo

Ver estadísticas en Cloudflare Dashboard:
- **Workers & Pages** > tu worker > **Metrics**
  - Peticiones por país
  - Tasa de redirecciones
  - Errores

## 🔄 Personalización

### Permitir múltiples países

```javascript
const ALLOWED_COUNTRIES = ['ES', 'PT', 'FR']; // España, Portugal, Francia

if (!ALLOWED_COUNTRIES.includes(country)) {
  return Response.redirect(GEO_BLOCK_URL, 302);
}
```

### Excluir rutas específicas

```javascript
const BYPASS_PATHS = ['/api', '/admin', '/webhook'];
const shouldBypass = BYPASS_PATHS.some(path => url.pathname.startsWith(path));

if (shouldBypass) {
  return fetch(request);
}
```

## 🆘 Solución de problemas

| Problema | Solución |
|----------|----------|
| Worker no redirige | Verificar que las rutas estén configuradas correctamente |
| Bucle de redirección | Asegurar que la condición anti-bucle esté presente |
| Cambios no se ven | Purgar caché en Cloudflare Dashboard |
| Logo no se ve | Verificar que `Logo.webp` esté en el mismo directorio |

## 📚 Documentación adicional

- [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) - Configuración manual paso a paso
- [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) - Despliegue automático con CI/CD

## 💻 Desarrollo local

```bash
# Instalar Wrangler CLI (opcional)
npm install -g wrangler

# Ejecutar worker localmente
wrangler dev

# Desplegar desde CLI
wrangler deploy
```

## 📝 Licencia

© 2025 Café el Gato - Todos los derechos reservados

---

**Hecho con ☕ para Café El Gato**
