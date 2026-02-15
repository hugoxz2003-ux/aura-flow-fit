# Actualizar GitHub Pages - URGENTE

## El botón no funciona porque:
La URL del webhook está en modo "test" pero tu n8n está en modo "production".

## Solución (2 minutos):

### Opción A: Actualizar el archivo en GitHub (Recomendado)
1. Ve a tu repositorio: https://github.com/hugoxz2003-ux/aura-flow-fit
2. Click en el archivo `script.js`
3. Click en el ícono de lápiz ✏️ (Edit)
4. Busca la línea 129 que dice:
   ```javascript
   await fetch('https://auraflowfit.app.n8n.cloud/webhook-test/6539874a-c7e6-4e03-a964-0a5de374fdf5', {
   ```
5. Cambia `webhook-test` por `webhook`:
   ```javascript
   await fetch('https://auraflowfit.app.n8n.cloud/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5', {
   ```
6. Scroll abajo → "Commit changes" → "Commit changes"
7. Espera 1 minuto y prueba de nuevo

### Opción B: Subir el archivo actualizado
1. Yo ya actualicé el archivo `script.js` en tu carpeta local
2. Ve a GitHub → tu repositorio
3. Click en `script.js` → ícono de tres puntos → "Delete file"
4. Luego "Add file" → "Upload files"
5. Arrastra el nuevo `script.js` desde tu carpeta
6. Commit changes

### Opción C: Cambiar n8n a modo Test
Si prefieres no tocar GitHub:
1. En n8n, desactiva el workflow (switch a gris)
2. Usa "Listen for Test Event" cada vez que quieras probar
3. (No recomendado para producción)

---

## ¿Cómo saber cuál URL usar?

- **Workflow ACTIVO (switch verde)** → usa `webhook/...`
- **Workflow INACTIVO (probando)** → usa `webhook-test/...`
