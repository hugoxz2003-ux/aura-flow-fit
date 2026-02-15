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
2. Arrastra estos archivos desde tu carpeta `aura_flow_fit`:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - (Si tienes la carpeta `images/`, súbela también)
3. Escribe un mensaje: "Initial commit - Aura Flow Fit landing page"
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

## Dominio Personalizado (Opcional)
Si quieres usar `www.auraflowfit.cl` en vez de `.github.io`:
1. Compra el dominio en NIC Chile o similar
2. En GitHub Pages Settings → "Custom domain"
3. Configura los DNS según las instrucciones de GitHub
