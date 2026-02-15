# Configurar Email de Confirmación Automático

## 🎯 Objetivo
Cuando alguien llene el formulario, recibirá un email automático de confirmación.

---

## 📧 Opción 1: Gmail (Más Fácil)

### Paso 1: Preparar tu Gmail
1. Ve a tu cuenta de Gmail
2. Activa la verificación en 2 pasos (si no la tienes)
3. Ve a: https://myaccount.google.com/apppasswords
4. Crea una "Contraseña de aplicación":
   - Selecciona app: "Correo"
   - Selecciona dispositivo: "Otro" → escribe "n8n"
   - Copia la contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)

### Paso 2: Agregar Nodo de Gmail en n8n
1. En tu workflow, después del nodo **Supabase**, haz click en el **+**
2. Busca **"Gmail"**
3. Selecciona **"Send Email"**

### Paso 3: Configurar Credenciales
1. Click en "Create New Credential"
2. Elige **"Gmail OAuth2 API"** o **"Gmail SMTP"**
   
**Si eliges SMTP (más simple):**
- User: tu-email@gmail.com
- Password: la contraseña de aplicación de 16 caracteres
- Host: smtp.gmail.com
- Port: 465
- SSL: Activado

### Paso 4: Configurar el Email
En el nodo de Gmail:

**To (Destinatario):**
```
{{ $json.body.email }}
```

**Subject (Asunto):**
```
¡Gracias por contactar a Aura Flow Fit! 🧘‍♀️
```

**Message (Cuerpo del email):**
```html
Hola {{ $json.body.name }},

¡Gracias por tu interés en Aura Flow Fit!

Hemos recibido tu mensaje:
"{{ $json.body.message }}"

Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas para coordinar tu primera sesión.

Mientras tanto, te invitamos a seguirnos en Instagram: @auraflowfit

¡Nos vemos pronto!

---
Equipo Aura Flow Fit
📍 A una cuadra de Escuela Militar, Las Condes
📧 contacto@auraflowfit.cl
📱 +56 9 1234 5678
```

**Email Type:**
- Selecciona **"Text"** (o "HTML" si quieres formato)

---

## 📧 Opción 2: Email HTML Premium

Si quieres un email más bonito, usa **HTML**:

**Message (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0891B2, #06B6D4); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .message-box { background: #f0f9ff; border-left: 4px solid #06B6D4; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #18181B; color: #A1A1AA; padding: 30px; text-align: center; font-size: 14px; }
        .footer a { color: #06B6D4; text-decoration: none; }
        .cta-button { display: inline-block; background: #06B6D4; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ Aura Flow Fit</h1>
        </div>
        <div class="content">
            <h2>¡Hola {{ $json.body.name }}!</h2>
            <p>Gracias por contactarnos. Hemos recibido tu mensaje:</p>
            <div class="message-box">
                <em>"{{ $json.body.message }}"</em>
            </div>
            <p>Nuestro equipo se pondrá en contacto contigo en las próximas <strong>24 horas</strong> para coordinar tu primera sesión.</p>
            <p>Mientras tanto, te invitamos a conocer más sobre nosotros:</p>
            <a href="https://hugoxz2003-ux.github.io/aura-flow-fit/" class="cta-button">Visitar Nuestro Sitio</a>
        </div>
        <div class="footer">
            <p><strong>Aura Flow Fit</strong></p>
            <p>📍 A una cuadra de Escuela Militar, Las Condes</p>
            <p>📧 <a href="mailto:contacto@auraflowfit.cl">contacto@auraflowfit.cl</a></p>
            <p>📱 +56 9 1234 5678</p>
            <p style="margin-top: 20px; font-size: 12px;">
                © 2024 Aura Flow Fit. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 📧 Opción 3: Otro Proveedor (SendGrid, Mailgun, etc.)

Si prefieres usar un servicio profesional:

### SendGrid (Gratis hasta 100 emails/día)
1. Crea cuenta en https://sendgrid.com
2. Obtén tu API Key
3. En n8n, busca el nodo **"SendGrid"**
4. Configura igual que Gmail

### Resend (Moderno, fácil)
1. Crea cuenta en https://resend.com
2. Obtén tu API Key
3. En n8n, busca **"HTTP Request"** y usa la API de Resend

---

## 🔗 Estructura Final del Workflow

Tu workflow debe verse así:

```
[Webhook] → [Supabase] → [Gmail/Email]
                ↓
         (Guardar lead)
                ↓
         (Enviar confirmación)
```

**Conexión:**
- Webhook conectado a Supabase
- Supabase conectado a Gmail

---

## ✅ Verificar que Funciona

1. Activa el workflow
2. Envía el formulario desde tu web con TU email
3. Revisa tu bandeja de entrada
4. Deberías recibir el email de confirmación en segundos

---

## 💡 Bonus: Email de Notificación para TI

También puedes recibir un email cuando llegue un lead:

1. Agrega OTRO nodo de Gmail después de Supabase
2. Configúralo así:

**To:** tu-email@auraflowfit.cl
**Subject:** 🔔 Nuevo Lead: {{ $json.body.name }}
**Message:**
```
Nuevo contacto recibido:

Nombre: {{ $json.body.name }}
Email: {{ $json.body.email }}
Mensaje: {{ $json.body.message }}
Fecha: {{ $json.timestamp }}

Revisa Supabase para más detalles.
```

---

## 🎨 Personalización Avanzada

### Agregar Logo
En el email HTML, agrega:
```html
<img src="URL_DE_TU_LOGO" alt="Aura Flow Fit" style="max-width: 150px;">
```

### Condicionales
Si quieres enviar diferentes emails según el mensaje:
1. Agrega un nodo **"IF"** antes del email
2. Condición: `{{ $json.body.message.includes('precio') }}`
3. Si es true → Email sobre precios
4. Si es false → Email genérico

---

## 🆘 Solución de Problemas

**Error: "Authentication failed"**
- Verifica que la contraseña de aplicación esté correcta
- Asegúrate de tener verificación en 2 pasos activa

**El email no llega**
- Revisa la carpeta de Spam
- Verifica que el email del cliente esté correcto
- Revisa los logs de n8n (Executions)

**Email sin formato**
- Asegúrate de seleccionar "HTML" en Email Type
- Verifica que las comillas estén correctas en el HTML
