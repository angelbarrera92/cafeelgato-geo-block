# 🚀 Guía de configuración en Cloudflare

## Paso 1: Desplegar la página de geo-bloqueo en Cloudflare Pages

### Opción A: Usando Git (Recomendado)

1. **Crea un repositorio en GitHub/GitLab**
   ```bash
   cd /Users/barreang/personal/cafeelgato-geo-block
   git init
   git add .
   git commit -m "Initial commit: Sistema de geo-bloqueo para Café El Gato"
   git branch -M main
   git remote add origin <tu-url-de-repositorio>
   git push -u origin main
   ```

2. **Conecta el repositorio a Cloudflare Pages**
   - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Selecciona tu cuenta
   - Ve a **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
   - Selecciona tu repositorio
   - Configuración de build:
     - **Project name**: `cafeelgato-geo-block`
     - **Build command**: (déjalo vacío)
     - **Build output directory**: `/`
     - **Root directory**: `/`
   - Haz clic en **Save and Deploy**

3. **Obtén la URL de despliegue**
   - Una vez desplegado, obtendrás una URL como: `https://cafeelgato-geo-block.pages.dev`
   - Guarda esta URL para el siguiente paso

### Opción B: Subida directa (Más rápida para pruebas)

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages** > **Create application** > **Pages** > **Upload assets**
4. Arrastra el contenido de la carpeta `public/`:
   - `index.html`
   - `styles.css`
   - `Logo.webp`
5. Dale un nombre al proyecto: `cafeelgato-geo-block`
6. Haz clic en **Deploy site**

---

## Paso 2: Crear el Cloudflare Worker

### 1. Crear el Worker

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages** > **Create application** > **Create Worker**
4. Dale un nombre al worker: `cafeelgato-geo-block`
5. Haz clic en **Deploy**

### 2. Editar el código del Worker

1. Una vez creado, haz clic en **Edit code**
2. Borra todo el código de ejemplo
3. Copia y pega el contenido del archivo `worker.js`
4. **IMPORTANTE**: Actualiza la línea `const GEO_BLOCK_URL` con tu URL real de Pages
   ```javascript
   const GEO_BLOCK_URL = 'https://cafeelgato-geo-block.pages.dev'; // Tu URL real aquí
   ```
5. Haz clic en **Save and Deploy**

### 3. Asociar el Worker a tu dominio

⚠️ **IMPORTANTE**: Si ya tienes reglas configuradas en Cloudflare (WAF, bloqueo de bots, firewall rules, etc.), el Worker se ejecuta **DESPUÉS** de esas reglas. Esto significa:
- ✅ Las reglas de seguridad se ejecutan primero
- ✅ El geo-bloqueo se ejecuta después, solo para tráfico legítimo
- ✅ No necesitas cambiar tus reglas existentes

Tienes dos opciones para asociar el Worker:

#### Opción A: Ruta específica (Recomendado)

Esta opción te da más control y permite excluir ciertas rutas del geo-bloqueo.

1. Ve a **Workers & Pages** > tu worker `cafeelgato-geo-block`
2. Ve a la pestaña **Triggers**
3. Haz clic en **Add route**
4. Configura:
   - **Route**: `cafeelgato.com/*`
   - **Zone**: Selecciona `cafeelgato.com`
5. Haz clic en **Save**

**Nota**: Si quieres excluir ciertas rutas (por ejemplo `/admin` o `/api`), puedes:
- Agregar múltiples rutas específicas: `cafeelgato.com/tienda/*`, `cafeelgato.com/producto/*`
- O usar la configuración avanzada en el código del Worker (ver más abajo)

#### Opción B: Dominio completo

Solo recomendado si quieres aplicar geo-bloqueo a TODO el sitio.

1. Ve a **Workers & Pages** > tu worker `cafeelgato-geo-block`
2. Ve a la pestaña **Triggers**
3. En **Custom Domains**, haz clic en **Add Custom Domain**
4. Ingresa: `cafeelgato.com`
5. Haz clic en **Add Custom Domain**

---

## Paso 3: Probar el Worker

### Método 1: Usando una VPN
1. Conéctate a una VPN de otro país (USA, UK, etc.)
2. Visita `cafeelgato.com`
3. Deberías ser redirigido a la página de geo-bloqueo

### Método 2: Usando el navegador (para desarrollo)
Agrega este código temporal al principio del worker para simular otros países:

```javascript
// SOLO PARA PRUEBAS - Eliminar después
// const country = 'US'; // Simula USA
// const country = 'ES'; // Simula España
const country = request.cf?.country;
```

### Método 3: Usando curl
```bash
# Simular petición desde España
curl -H "CF-IPCountry: ES" https://cafeelgato.com

# Simular petición desde USA
curl -H "CF-IPCountry: US" https://cafeelgato.com
```

---

## 📊 Monitoreo y Analytics

### Ver estadísticas del Worker
1. Ve a **Workers & Pages** > tu worker
2. Ve a la pestaña **Metrics**
3. Podrás ver:
   - Peticiones por país
   - Tasa de redirecciones
   - Errores (si los hay)

---

## 🔧 Configuración avanzada

### Compatibilidad con reglas existentes

Si tienes configuraciones específicas que no quieres que pasen por el geo-bloqueo:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const country = request.cf?.country;
    
    // Rutas que NO necesitan geo-bloqueo (ej: APIs, admin, webhooks)
    const BYPASS_PATHS = ['/api', '/admin', '/webhook', '/healthcheck'];
    const shouldBypass = BYPASS_PATHS.some(path => url.pathname.startsWith(path));
    
    if (shouldBypass) {
      // Dejar pasar sin geo-bloqueo
      return fetch(request);
    }
    
    // Aplicar geo-bloqueo al resto
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

### Permitir múltiples países

Si en el futuro quieres permitir más países, edita el worker:

```javascript
// Lista de países permitidos
const ALLOWED_COUNTRIES = ['ES', 'PT', 'FR']; // España, Portugal, Francia

if (!ALLOWED_COUNTRIES.includes(country)) {
  // Redirigir a geo-block
  return Response.redirect(GEO_BLOCK_URL, 302);
}
```

### Excluir ciertas rutas

Si quieres que ciertas páginas sean accesibles desde cualquier país:

```javascript
const url = new URL(request.url);

// Lista de rutas que NO requieren geo-bloqueo
const EXCLUDED_PATHS = ['/about', '/contact', '/blog'];

const isExcluded = EXCLUDED_PATHS.some(path => url.pathname.startsWith(path));

if (!isExcluded && country !== 'ES') {
  return Response.redirect(GEO_BLOCK_URL, 302);
}
```

### Agregar logging para debugging

```javascript
console.log('País detectado:', country);
console.log('URL solicitada:', request.url);
```

Los logs se pueden ver en **Workers & Pages** > tu worker > **Logs** (requiere activar Real-time Logs)

---

## ⚠️ Importante

1. **Caché de Cloudflare**: Después de hacer cambios, puede tomar unos minutos en propagarse
2. **Purgar caché**: Si haces cambios y no los ves reflejados:
   - Ve a **Caching** > **Configuration**
   - Haz clic en **Purge Everything**
3. **Límites**: El plan gratuito de Workers tiene 100,000 peticiones/día (más que suficiente para empezar)
4. **Orden de ejecución en Cloudflare**:
   ```
   1. DNS Resolution
   2. DDoS Protection
   3. Firewall Rules (WAF, IP Access Rules, etc.) ← Tus reglas actuales
   4. Rate Limiting
   5. Workers ← Tu geo-bloqueo se ejecuta aquí
   6. Caché
   7. Origin Server (tu web)
   ```
   **Conclusión**: Tus reglas de seguridad existentes se ejecutan ANTES del Worker, por lo que no hay conflicto.

---

## 🆘 Resolución de problemas

### El worker no redirige
- Verifica que el worker esté asociado a la ruta correcta
- Verifica que `GEO_BLOCK_URL` tenga la URL correcta
- Purga la caché de Cloudflare

### Bucle de redirección infinito
- Asegúrate de que la condición `!url.hostname.includes('cafeelgato-geo-block.pages.dev')` esté presente
- Verifica que no tengas el worker aplicado a la URL de geo-block

### La página de geo-block no se ve bien
- Verifica que `Logo.webp` se haya subido correctamente
- Verifica que `styles.css` esté en el mismo directorio que `index.html`

---

## 💡 Siguiente nivel: Personalización por país

Si quieres mostrar mensajes diferentes según el país:

```javascript
const MESSAGES = {
  'US': 'Currently, Café El Gato is only available in Spain.',
  'FR': 'Actuellement, Café El Gato est uniquement disponible en Espagne.',
  'DE': 'Derzeit ist Café El Gato nur in Spanien verfügbar.',
  'default': 'Actualmente, Café El Gato solo está disponible en España.'
};

// Pasar el país como parámetro
return Response.redirect(`${GEO_BLOCK_URL}?country=${country}`, 302);
```

Y en tu página de geo-block, puedes leer el parámetro con JavaScript y mostrar el mensaje apropiado.

---

¿Necesitas ayuda con algún paso específico? 🚀
