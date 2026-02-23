# Guía de Edición: Aura Flow Fit

Esta guía te explica cómo hacer cambios en tu landing page directamente desde la web de GitHub, sin necesidad de instalar programas complicados.

## 1. Cambiar Textos (Nombres, Descripciones, Precios)
Los textos están en el archivo `index.html`.

1. Entra a tu repositorio en GitHub.
2. Haz clic en `index.html`.
3. Haz clic en el icono del **lápiz (Edit this file)** ✏️.
4. **Para buscar rápido**: Presiona `Ctrl + F` (o `Cmd + F` en Mac) y escribe la palabra que quieres cambiar (ej: "Socio Fundador").
5. Cambia el texto que está entre las etiquetas (ej: `<span>Mi Texto</span>`). 
   > [!WARNING]
   > Cuidado con no borrar los signos `<` o `>`. Solo cambia lo que está en medio.
6. Baja al final y haz clic en **"Commit changes"**.

## 2. Cambiar Colores (El color Calypso)
Si quieres cambiar el color principal de la marca, debes editar `styles.css`.

1. Entra a `styles.css` y dale al lápiz ✏️.
2. Busca la sección `:root` al principio del archivo (Línea 5-23).
3. Verás variables como `--primary-500: #06B6D4;`.
4. Cambia ese código Hexadecimal (`#06B6D4`) por el color que prefieras. 
   > [!TIP]
   > Puedes buscar "Color Picker" en Google para obtener códigos como #FF5733.

## 3. Cambiar Imágenes
Como vimos en la tabla anterior, solo debes subir un archivo con el mismo nombre a la carpeta `images/`.

1. Entra a la carpeta `images/` en GitHub.
2. Haz clic en **"Add file"** -> **"Upload files"**.
3. Arrastra tu nueva foto (asegúrate que se llame igual, ej: `hero-pilates.jpg`).
4. Dale a **"Commit changes"**. GitHub reemplazará la versión anterior automáticamente.

## 4. Tip: ¿No ves la fecha en n8n?
Si al configurar n8n no ves el campo `timestamp` o `fecha` en el listado, puedes escribirlo manualmente en el campo de "Fecha":
`{{ $json.timestamp }}` o simplemente usar la fecha actual del sistema: `{{ $now }}`.

## 5. ¿Cuándo se ven los cambios?
GitHub tarda entre **1 a 3 minutos** en procesar los cambios. Después de ese tiempo, refresca tu página (puedes necesitar vaciar la caché con `Ctrl + F5`).

---
> [!IMPORTANT]
> **Antes de cada cambio importante**, te recomiendo copiar todo el contenido del archivo y pegarlo en un Bloc de Notas como respaldo. ¡Si algo sale mal, simplemente pegas el respaldo de vuelta!
