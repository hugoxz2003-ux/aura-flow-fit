# Solución al Error de CORS en el Formulario

## El Problema
Cuando abres `index.html` directamente (doble clic), el navegador bloquea el envío de datos a n8n por seguridad (política CORS).

## Soluciones (Elige UNA)

### ✅ Opción 1: Subir a Internet (RECOMENDADO - 5 minutos)
La forma más rápida y profesional:

1. **Netlify Drop** (Sin cuenta necesaria):
   - Ve a [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Arrastra la carpeta `aura_flow_fit` completa
   - ¡Listo! Te da un link tipo `https://tu-sitio.netlify.app`

2. **Vercel** (Requiere cuenta GitHub gratis):
   - Ve a [https://vercel.com](https://vercel.com)
   - Conecta tu GitHub
   - Importa el proyecto
   - Deploy automático

### ⚙️ Opción 2: Servidor Local con VS Code
Si usas Visual Studio Code:

1. Instala la extensión **"Live Server"** (buscala en Extensions)
2. Click derecho en `index.html` → "Open with Live Server"
3. Se abrirá en `http://localhost:5500` (sin errores CORS)

### 🐍 Opción 3: Instalar Python (Si quieres aprender)
1. Descarga Python: [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Durante instalación: ✅ marca "Add Python to PATH"
3. Abre terminal en la carpeta del proyecto
4. Ejecuta: `python -m http.server 8000`
5. Abre: `http://localhost:8000`

### 🟢 Opción 4: Instalar Node.js
1. Descarga Node.js: [https://nodejs.org/](https://nodejs.org/)
2. Instala `npx` (viene incluido)
3. En la carpeta del proyecto: `npx serve`
4. Abre el link que te muestre

## ¿Cuál elegir?
- **¿Quieres compartir la web ya?** → Netlify Drop (Opción 1)
- **¿Solo probar localmente?** → VS Code Live Server (Opción 2)
- **¿Vas a desarrollar más?** → Python o Node.js (Opciones 3-4)
