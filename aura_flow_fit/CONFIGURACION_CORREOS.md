# Configuración de Correos Profesionales: @auraflowfit.cl

Para proyectar una imagen profesional, es fundamental tener correos corporativos. Aquí tienes las dos mejores opciones según tu requerimiento de economía y profesionalismo.

---

## Opción 1: Cloudflare Email Routing (Gratis para siempre)
**Ideal si solo quieres recibir correos y responder desde tu @gmail personal.**

Esta opción redirige todo lo que llegue a `contacto@auraflowfit.cl` directamente a tu correo personal (ej: `tu-nombre@gmail.com`).

### Pasos para configurar:
1. **Mueve tus DNS a Cloudflare**:
   - Crea una cuenta gratis en [Cloudflare](https://www.cloudflare.com).
   - Agrega tu sitio `auraflowfit.cl`.
   - Cloudflare te dará dos "Nameservers" (ej: `adrian.ns.cloudflare.com`).
   - Ve al panel de **NIC Chile**, selecciona tu dominio y reemplaza los servidores de nombre actuales por los de Cloudflare.
2. **Activar Email Routing**:
   - En el panel de Cloudflare, ve a la sección **Email** -> **Email Routing**.
   - Haz clic en "Enforce DNS" (Cloudflare configurará los registros MX automáticamente).
   - Crea una **"Destination address"**: tu correo de Gmail actual.
   - Crea una **"Custom address"**: escribe `contacto` y selecciona tu dirección de Gmail como destino.
3. **¡Listo!**: Cualquier correo enviado a esa dirección llegará a tu Gmail.

> [!TIP]
> Puedes configurar Gmail para "Enviar como" `contacto@auraflowfit.cl` usando el servidor SMTP de Google, manteniendo la gratuidad total.

---

## Opción 2: Zoho Mail (Desde ~$1 USD al mes)
**Ideal si necesitas un buzón independiente y profesional con su propia App.**

Zoho es la alternativa más económica y robusta frente a Google Workspace o Outlook.

### Características:
- **Profesionalismo**: Tienes una bandeja de entrada separada (no mezclada con lo personal).
- **App Móvil**: Excelente aplicación para gestionar correos desde el celular.
- **Seguridad**: Altísimos estándares de privacidad.

### Pasos para configurar:
1. Regístrate en [Zoho Mail](https://www.zoho.com/mail/zohomail-pricing.html) seleccionando el plan "Mail Lite".
2. Sigue el asistente para verificar tu dominio (te darán un código TXT que debes pegar en el panel de DNS de Cloudflare o NIC.cl).
3. Configura los registros **MX, SPF y DKIM** (fundamentales para que tus correos no lleguen a SPAM).

---

## Recomendación de Antigravity
Si estás empezando y quieres costo cero, **Cloudflare Email Routing** es imbatible. Te permite tener múltiples variantes (`hola@`, `ventas@`, `contacto@`) todas dirigidas a tu Gmail actual sin pagar un peso extra.
