# Guía de Configuración n8n: Aura Flow Fit

Sigue estos pasos cuando estés listo para conectar tu formulario con tu nuevo correo profesional.

## 1. Verificar el Webhook de Entrada
- **Nodo:** Webhook
- **URL de Producción:** `https://auraflowfit.app.n8n.cloud/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5`
- **Método:** POST
- **Configuración Clave:** 
  - Asegúrate de que el flujo esté **Active** (switch arriba a la derecha).
  - En la pestaña "Settings" del nodo Webhook, verifica que los **CORS** permitan `*` o el dominio `https://auraflow.cl`.

## 2. Agregar Nodo de Envío de Email
Busca el nodo "Gmail" o "Send Email (SMTP)".

### Configuración del nodo:
- **Authentication:** Conecta tu cuenta (puede ser Gmail o los datos SMTP de Zoho).
- **Resource:** Message (si usas Gmail).
- **Operation:** Send.
- **To (Destinatario):** `contacto@auraflow.cl`
- **Subject (Asunto):** `[NUEVO LEAD] Consulta desde la Web`
- **Body (Cuerpo):** Usa expresiones para mapear los datos del formulario:
  - Nombre: `{{ $json.nombre }}`
  - Email: `{{ $json.email }}`
  - Mensaje: `{{ $json.mensaje }}`

## 3. Pruebas Finales
1. Ve a `https://auraflow.cl`.
2. Completa el formulario con datos ficticios.
3. Revisa en n8n la pestaña "Executions" para confirmar que el flujo se completó con éxito (color verde).
4. Revisa tu bandeja de entrada en [Zoho Mail](https://mail.zoho.com).

> [!TIP]
> **Pro Tip:** Puedes agregar un segundo nodo de email para enviarle una "Respuesta de Cortesía" automática al cliente diciendo: *"Gracias por contactarnos, nos comunicaremos contigo pronto"*.

---
*Aura Flow Fit - Lanzamiento 2026*
