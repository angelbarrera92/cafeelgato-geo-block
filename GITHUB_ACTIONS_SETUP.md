# 🤖 Despliegue automático con GitHub Actions

Este proyecto incluye configuración para despliegue automático a Cloudflare usando GitHub Actions.

## 📋 Requisitos previos

1. Cuenta de GitHub
2. Cuenta de Cloudflare
3. Repositorio de GitHub con este código

## 🔧 Configuración inicial (solo una vez)

### Paso 1: Obtener credenciales de Cloudflare

#### 1.1. API Token

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Haz clic en **Create Token**
3. Usa la plantilla **Edit Cloudflare Workers**
4. O crea un token personalizado con estos permisos:
   - **Account** > **Cloudflare Pages** > **Edit**
   - **Account** > **Workers Scripts** > **Edit**
   - **Zone** > **Workers Routes** > **Edit**
5. Copia el token generado (solo se muestra una vez)

#### 1.2. Account ID

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu cuenta
3. En la barra lateral derecha, copia el **Account ID**

### Paso 2: Configurar secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Secrets and variables** > **Actions**
3. Haz clic en **New repository secret**
4. Agrega estos secretos:

   **Secreto 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [El token que copiaste en el paso 1.1]

   **Secreto 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: [El Account ID que copiaste en el paso 1.2]

### Paso 3: Crear el proyecto en Cloudflare Pages (primera vez)

#### Opción A: Desde el Dashboard (Recomendado para primera vez)

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Ve a **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Autoriza GitHub y selecciona tu repositorio
4. Configuración:
   - **Project name**: `cafeelgato-geo-block`
   - **Production branch**: `main`
   - **Build command**: (vacío)
   - **Build output directory**: `/`
5. Haz clic en **Save and Deploy**

#### Opción B: Automático con GitHub Actions

Si ya configuraste los secretos, simplemente haz push al repositorio y la GitHub Action creará el proyecto automáticamente.

### Paso 4: Actualizar la URL en el Worker

Después del primer despliegue:

1. Obtén la URL de Cloudflare Pages (ej: `https://cafeelgato-geo-block.pages.dev`)
2. Actualiza el archivo `worker.js`:
   ```javascript
   const GEO_BLOCK_URL = 'https://cafeelgato-geo-block.pages.dev'; // Tu URL aquí
   ```
3. Haz commit y push de este cambio

---

## 🚀 Uso diario

Una vez configurado, el despliegue es **completamente automático**:

### Desplegar cambios

```bash
# 1. Haz tus cambios
git add .
git commit -m "Actualizar diseño"
git push origin main

# ¡Eso es todo! GitHub Actions se encarga del resto
```

### Monitorear el despliegue

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. Verás el progreso del despliegue en tiempo real
4. Si algo falla, verás el error y los logs

### Despliegue manual

También puedes disparar un despliegue manual sin hacer commits:

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Cloudflare**
3. Haz clic en **Run workflow**
4. Selecciona la rama `main`
5. Haz clic en **Run workflow**

---

## 📁 Estructura del proyecto

```
cafeelgato-geo-block/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Action para despliegue automático
├── public/                         # Archivos estáticos (desplegados a Pages)
│   ├── index.html                  # Página de geo-bloqueo
│   ├── styles.css                  # Estilos CSS
│   └── Logo.webp                   # Logo de Café El Gato
├── worker.js                       # Cloudflare Worker
├── wrangler.toml                   # Configuración de Wrangler
├── .gitignore                      # Archivos ignorados por git
├── README.md                       # Documentación general
├── CLOUDFLARE_SETUP.md             # Guía manual de Cloudflare
└── GITHUB_ACTIONS_SETUP.md         # Esta guía
```

---

## 🔍 Qué hace la GitHub Action

Cada vez que haces push a `main`, automáticamente:

1. ✅ **Despliega la página estática** a Cloudflare Pages
   - Usa `wrangler-action` (la nueva acción oficial recomendada)
   - Sube únicamente el contenido del directorio `public/`:
     - `index.html`
     - `styles.css`
     - `Logo.webp`
   - No incluye archivos de configuración ni documentación

2. ✅ **Despliega el Worker** a Cloudflare Workers
   - Actualiza el código de `worker.js`
   - Mantiene las rutas configuradas para:
     - `cafeelgato.com/*`
     - `www.cafeelgato.com/*`

3. ✅ **Verifica** que todo se desplegó correctamente

### 📝 Nota sobre la migración

Este proyecto usa `wrangler-action@v3` que es la acción oficial recomendada por Cloudflare. La anterior `pages-action@v1` fue deprecada en octubre de 2024.

---

## ⚙️ Configuración avanzada

### Desplegar a múltiples entornos

Puedes crear entornos de staging y producción:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches:
      - main        # Producción
      - staging     # Staging
```

### Agregar pruebas antes del despliegue

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          # Tus pruebas aquí
          echo "Running tests..."
  
  deploy:
    needs: test  # Solo despliega si las pruebas pasan
    runs-on: ubuntu-latest
    # ... resto del job
```

### Notificaciones

Agregar notificaciones cuando el despliegue termina:

```yaml
- name: Notify success
  if: success()
  run: |
    echo "✅ Despliegue exitoso"
    # Aquí puedes agregar notificaciones a Slack, Discord, etc.
```

---

## 🆘 Resolución de problemas

### Error: "API token invalid"
- Verifica que el token de Cloudflare sea correcto
- Asegúrate de que el token tenga los permisos necesarios
- Genera un nuevo token si es necesario

### Error: "Account ID invalid"
- Verifica que copiaste correctamente el Account ID
- No confundas Account ID con Zone ID

### Error: "Project not found"
- La primera vez, crea el proyecto manualmente desde el Dashboard
- O asegúrate de que el nombre del proyecto coincida con `wrangler.toml`

### El Worker no se despliega
- Verifica que `wrangler.toml` esté correctamente configurado
- Revisa los logs en la pestaña Actions de GitHub

### Cambios no se reflejan
- Verifica que el despliegue se completó en la pestaña Actions
- Purga el caché de Cloudflare si es necesario
- Espera 1-2 minutos para la propagación

---

## 📊 Monitoreo

### Ver el estado del último despliegue

GitHub muestra un badge en tu README:

```markdown
![Deploy Status](https://github.com/TU_USUARIO/cafeelgato-geo-block/actions/workflows/deploy.yml/badge.svg)
```

### Logs detallados

- Ve a **Actions** > Selecciona el workflow > Ver logs detallados de cada paso

---

## 💡 Ventajas del despliegue automático

✅ **Sin intervención manual** - Solo haz push y listo  
✅ **Consistente** - Siempre se despliega de la misma forma  
✅ **Rastreable** - Historial completo de despliegues  
✅ **Reversible** - Fácil rollback a versiones anteriores  
✅ **Rápido** - Despliegue en menos de 2 minutos  

---

## 🔄 Rollback (volver a versión anterior)

Si algo sale mal:

```bash
# Ver commits anteriores
git log --oneline

# Volver a un commit específico
git revert <commit-hash>
git push origin main

# O hacer reset (más agresivo)
git reset --hard <commit-hash>
git push origin main --force
```

La GitHub Action automáticamente desplegará la versión anterior.

---

## 📚 Recursos adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages CI/CD](https://developers.cloudflare.com/pages/platform/deploy-hooks/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ Checklist de configuración

- [ ] Token de Cloudflare creado
- [ ] Account ID copiado
- [ ] Secretos configurados en GitHub
- [ ] Proyecto de Pages creado (primera vez)
- [ ] URL actualizada en `worker.js`
- [ ] Primer push realizado
- [ ] Despliegue verificado en Actions
- [ ] Sitio funcionando correctamente

---

¿Todo listo? ¡Haz tu primer push y observa la magia! 🚀✨
