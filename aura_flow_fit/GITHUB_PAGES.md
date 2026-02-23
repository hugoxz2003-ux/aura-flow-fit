# Guía: Publicar Aura Flow Fit en GitHub Pages

## Paso 1: Crear Repositorio en GitHub
1. Ve a [https://github.com](https://github.com) e inicia sesión (o crea cuenta gratis)
2. Click en el botón **"New"** (o el ícono **+** arriba a la derecha → "New repository")
3. Nombre del repositorio: `aura-flow-fit`
4. Descripción: "Landing page para Aura Flow Fit - Pilates Reformer"
5. Deja en **Public** (para que GitHub Pages funcione gratis)
6. ✅ Marca "Add a README file"
7. Click **"Create repository"**

## Paso 2: Subir los Archivos
Hay dos formas:

### Opción A: Desde la Web (Más Fácil)
1. En tu repositorio recién creado, click en **"Add file"** → **"Upload files"**
- **Carpetas** (Arrástralas enteras):
   - `dashboard/`
   - `client-app/`
   - `images/` (Si la tienes)
- **Archivos sueltos**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `shared-styles.css`
   - `supabase-config.js`
   - `README.md`
3. Escribe un mensaje: "Initial commit - Aura Flow Fit Full Platform"
4. Click **"Commit changes"**

### Opción B: Con Git (Si lo tienes instalado)
```bash
cd C:\Users\hugox\.gemini\antigravity\scratch\aura_flow_fit
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/aura-flow-fit.git
git push -u origin main
```

## Paso 3: Activar GitHub Pages
1. En tu repositorio, ve a **Settings** (⚙️ arriba a la derecha)
2. En el menú izquierdo, busca **"Pages"**
3. En **"Source"**, selecciona:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **"Save"**
5. Espera 1-2 minutos

## Paso 4: ¡Ver tu Sitio!
GitHub te mostrará un mensaje verde con tu URL:
```
Your site is live at https://TU-USUARIO.github.io/aura-flow-fit/
```

¡Esa es tu URL pública! Compártela donde quieras.

## Paso 5: Actualizar el Webhook en n8n (IMPORTANTE)
Ahora que tu sitio está en `https://`, el webhook funcionará sin problemas de CORS.

**NO necesitas cambiar nada en el código**, ya funciona con la URL de n8n que configuramos.

---

## Actualizar la Web en el Futuro
Cuando hagas cambios:
1. Ve a tu repositorio en GitHub
2. Click en el archivo que quieres editar (ej: `index.html`)
3. Click en el ícono de lápiz ✏️ (Edit)
4. Haz tus cambios
5. Scroll abajo → "Commit changes"
6. Espera 1-2 minutos y recarga tu sitio

---

## Dominio Personalizado (Tu Marca)
Si quieres usar `www.auraflowfit.cl` en vez de la URL de GitHub:

### 1. En NIC Chile (o tu proveedor)
Debes configurar los **Registros DNS**. Busca la sección de "Configuración de DNS" o "Registros" y agrega lo siguiente:

**A Records (Para auraflowfit.cl):**
Crea 4 registros tipo **A** que apunten a estas IPs:
*   `185.199.108.153`
*   `185.199.109.153`
*   `185.199.110.153`
*   `185.199.111.153`

**CNAME Record (Para www.auraflowfit.cl):**
Crea un registro **CNAME** con nombre `www` y valor `hugoxz2003-ux.github.io`.

### 2. En GitHub
1. Ve a **Settings** -> **Pages**.
2. En **Custom domain**, escribe `www.auraflowfit.cl` y dale a **Save**.
3. Espera a que la validación termine y marca **"Enforce HTTPS"**.

---
¡Felicidades! Ahora tu marca tiene presencia profesional en la web.
